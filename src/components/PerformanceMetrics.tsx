import React from 'react';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PerformanceMetric } from '../types';

interface PerformanceMetricsProps {
  data: PerformanceMetric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const getPerformanceStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 95) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 70) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'good':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (current < previous) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  return (
    <Card className="backdrop-blur-sm flex flex-col w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold">Performance vs Targets</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Current period performance against operational targets
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 overflow-hidden">
        <div className="space-y-4 overflow-y-auto max-h-64">
          {data.map((metric, index) => {
            const status = getPerformanceStatus(metric.current, metric.target);
            const percentage = (metric.current / metric.target) * 100;
            const trend = ((metric.current - metric.previous) / metric.previous * 100).toFixed(1);
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{metric.category}</span>
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(status))}>
                      {status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    {getTrendIcon(metric.current, metric.previous)}
                    <span className="text-muted-foreground">{trend}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {metric.current.toFixed(1)} / {metric.target.toFixed(1)}
                    </span>
                    <span className="font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="relative w-full bg-muted rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        status === 'excellent' && "bg-emerald-500",
                        status === 'good' && "bg-blue-500",
                        status === 'warning' && "bg-amber-500",
                        status === 'critical' && "bg-red-500"
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                    {/* Target line */}
                    <div className="absolute top-0 right-0 w-0.5 h-2 bg-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-400">
                {data.filter(m => getPerformanceStatus(m.current, m.target) === 'excellent').length}
              </div>
              <div className="text-xs text-muted-foreground">Exceeding Targets</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">
                {data.filter(m => ['warning', 'critical'].includes(getPerformanceStatus(m.current, m.target))).length}
              </div>
              <div className="text-xs text-muted-foreground">Need Attention</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;