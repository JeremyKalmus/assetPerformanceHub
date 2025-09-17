import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, TrendingUp } from 'lucide-react';
import { Site } from '../types';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  sites: Site[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ sites }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return '#10B981'; // emerald-500
      case 'warning':
        return '#F59E0B'; // amber-500
      case 'critical':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const createCustomIcon = (status: string) => {
    const color = getStatusColor(status);
    const svgIcon = `
      <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12.5" cy="12.5" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12.5" cy="12.5" r="4" fill="white"/>
      </svg>
    `;
    
    return L.divIcon({
      html: svgIcon,
      className: 'custom-marker',
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5],
    });
  };

  const formatOutput = (output: number) => {
    return output >= 1000 ? `${(output / 1000).toFixed(1)}GW` : `${output}MW`;
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on North America
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each site
    sites.forEach(site => {
      const marker = L.marker([site.location.lat, site.location.lng], {
        icon: createCustomIcon(site.status)
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-64">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-base">${site.name}</h3>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                  style="background-color: ${getStatusColor(site.status)}20; color: ${getStatusColor(site.status)};">
              ${site.status.charAt(0).toUpperCase() + site.status.slice(1)}
            </span>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Capacity:</span>
              <span class="font-medium">${formatOutput(site.capacity)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Current Output:</span>
              <span class="font-medium">${formatOutput(site.currentOutput)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Efficiency:</span>
              <span class="font-medium">${site.efficiency}%</span>
            </div>
          </div>
          
          ${site.latestAlarm ? `
            <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded">
              <div class="text-xs text-red-600 font-medium">Latest Alert:</div>
              <div class="text-xs text-red-800">${site.latestAlarm.title}</div>
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sites]);

  const totalCapacity = sites.reduce((sum, site) => sum + site.capacity, 0);
  const totalOutput = sites.reduce((sum, site) => sum + site.currentOutput, 0);
  const avgEfficiency = Math.round(sites.reduce((sum, site) => sum + site.efficiency, 0) / sites.length);

  return (
    <Card className="backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Global Site Overview</span>
          </CardTitle>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{formatOutput(totalOutput)} / {formatOutput(totalCapacity)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-muted-foreground">Avg Efficiency:</span>
              <span className="font-medium">{avgEfficiency}%</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div 
          ref={mapRef} 
          className="h-48 sm:h-64 w-full rounded-lg overflow-hidden border"
          style={{ minHeight: '256px' }}
        />
        
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Operational</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Offline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;