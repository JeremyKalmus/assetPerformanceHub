import React from 'react';
import { Gauge, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UtilizationData {
  siteId: string;
  siteName: string;
  capacity: number;
  currentOutput: number;
  peakToday: number;
  avgUtilization: number;
  status: 'optimal' | 'good' | 'low' | 'critical';
}

interface CapacityUtilizationProps {
  data: UtilizationData[];
}

const CapacityUtilization: React.FC<CapacityUtilizationProps> = ({ data }) => {
  const totalCapacity = data.reduce((sum, site) => sum + site.capacity, 0);
  const totalOutput = data.reduce((sum, site) => sum + site.currentOutput, 0);
  const overallUtilization = (totalOutput / totalCapacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'good':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'low':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'bg-emerald-500';
    if (utilization >= 60) return 'bg-blue-500';
    if (utilization >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="backdrop-blur-sm flex flex-col w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <Gauge className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold">Capacity Utilization</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Overall: {overallUtilization.toFixed(1)}% ({totalOutput.toFixed(0)}MW / {totalCapacity.toFixed(0)}MW)
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>{data.filter(s => s.status === 'optimal').length} optimal</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 overflow-hidden">
        <div className="space-y-4">
          {/* Overall Utilization Gauge */}
          <div className="text-center mb-6">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={getUtilizationColor(overallUtilization)}
                  strokeDasharray={`${(overallUtilization / 100) * 314} 314`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{overallUtilization.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
              </div>
            </div>
          </div>

          {/* Site-by-Site Breakdown */}
          <div className="space-y-3 overflow-y-auto max-h-64">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Site Performance</span>
            </h4>
            
            {data.map((site, index) => {
              const utilization = (site.currentOutput / site.capacity) * 100;
              const peakUtilization = (site.peakToday / site.capacity) * 100;
              
              return (
                <div key={index} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-sm truncate">{site.siteName}</span>
                      <Badge variant="outline" className={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{site.currentOutput.toFixed(0)}MW / {site.capacity.toFixed(0)}MW</div>
                      <div>Peak: {site.peakToday.toFixed(0)}MW</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {/* Current utilization */}
                    <div className="flex justify-between text-xs">
                      <span>Current</span>
                      <span>{utilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getUtilizationColor(utilization)}`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                    
                    {/* Peak utilization */}
                    <div className="flex justify-between text-xs">
                      <span>Peak Today</span>
                      <span>{peakUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="bg-primary/60 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${peakUtilization}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacityUtilization;