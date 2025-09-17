import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { KPIData } from '../types';

interface KPITilesProps {
  data: KPIData[];
}

const KPITiles: React.FC<KPITilesProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-emerald-500/50 bg-emerald-500/10';
      case 'warning':
        return 'border-amber-500/50 bg-amber-500/10';
      case 'critical':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {data.map((kpi, index) => (
        <Card
          key={index}
          className={cn(
            "border-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg",
            getStatusColor(kpi.status)
          )}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {kpi.label}
              </h3>
              <Badge variant="outline" className="flex items-center space-x-1 px-2 py-1">
                {getTrendIcon(kpi.trend)}
                <span className={cn("text-xs font-medium", getTrendColor(kpi.trend))}>
                  {kpi.trendValue}
                </span>
              </Badge>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl lg:text-3xl font-bold text-foreground">
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-sm text-muted-foreground">{kpi.unit}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPITiles;