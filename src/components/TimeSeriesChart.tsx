import React, { useState, useEffect } from 'react';
import { BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { TimeSeriesData } from '../types';

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const [selectedAsset, setSelectedAsset] = useState('turbine-01');
  const [smoothingWindow, setSmoothingWindow] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update timestamp when data changes
  useEffect(() => {
    setLastUpdate(new Date());
  }, [data]);

  const smoothData = (data: TimeSeriesData[], window: number): TimeSeriesData[] => {
    if (window <= 1) return data;
    
    return data.map((point, index) => {
      const start = Math.max(0, index - Math.floor(window / 2));
      const end = Math.min(data.length, index + Math.ceil(window / 2));
      const subset = data.slice(start, end);
      const avgValue = subset.reduce((sum, p) => sum + p.value, 0) / subset.length;
      
      return { ...point, value: avgValue };
    });
  };

  const smoothedData = smoothData(data.filter(d => d.assetId === selectedAsset), smoothingWindow);
  const maxValue = Math.max(...smoothedData.map(d => d.value));
  const minValue = Math.min(...smoothedData.map(d => d.value));

  return (
    <Card className="backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Live Performance Data</span>
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="turbine-01">Wind Turbine 01</SelectItem>
                <SelectItem value="turbine-02">Wind Turbine 02</SelectItem>
                <SelectItem value="turbine-03">Wind Turbine 03</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              title="Chart Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {lastUpdate.toLocaleTimeString()} • Updates every 90 seconds
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {showSettings && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <label className="block text-sm font-medium text-foreground mb-3">
              Smoothing Window: {smoothingWindow} points
            </label>
            <Slider
              value={[smoothingWindow]}
              onValueChange={(value) => setSmoothingWindow(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        )}

        <div className="h-48 sm:h-64 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <g className="opacity-20">
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="currentColor" strokeWidth="1" />
              ))}
            </g>
            
            {/* Chart line */}
            {smoothedData.length > 1 && (
              <>
                <path
                  d={`M ${smoothedData.map((point, index) => {
                    const x = (index / (smoothedData.length - 1)) * 800;
                    const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                    return `${x},${y}`;
                  }).join(' L ')}`}
                  fill="url(#chartGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                
                <path
                  d={`M ${smoothedData.map((point, index) => {
                    const x = (index / (smoothedData.length - 1)) * 800;
                    const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                    return `${x},${y}`;
                  }).join(' L ')} L 800,200 L 0,200 Z`}
                  fill="url(#chartGradient)"
                />
              </>
            )}
            
            {/* Data points */}
            {smoothedData.map((point, index) => {
              const x = (index / (smoothedData.length - 1)) * 800;
              const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 180;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="hsl(var(--primary))"
                  className="hover:r-5 transition-all cursor-pointer"
                />
              );
            })}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground -ml-8 sm:-ml-12">
            <span>{maxValue.toFixed(1)}</span>
            <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
            <span>{minValue.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;