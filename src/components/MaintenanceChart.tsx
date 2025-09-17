import React from 'react';
import { Wrench, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaintenanceData } from '../types';

interface MaintenanceChartProps {
  data: MaintenanceData[];
}

const MaintenanceChart: React.FC<MaintenanceChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.scheduled, d.unscheduled)));
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  
  const costTrend = latest.cost > previous.cost ? 'up' : 'down';
  const costChange = ((latest.cost - previous.cost) / previous.cost * 100).toFixed(1);

  return (
    <Card className="backdrop-blur-sm flex flex-col w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Wrench className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Maintenance Overview</span>
          </CardTitle>
          <Badge variant={costTrend === 'up' ? 'destructive' : 'default'} className="flex items-center space-x-1">
            {costTrend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{costChange}%</span>
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Current Month Cost: ${latest.cost.toLocaleString()}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 overflow-hidden">
        <div className="space-y-6">
          {/* Current Month Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{latest.scheduled}</div>
              <div className="text-xs text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-amber-400">{latest.unscheduled}</div>
              <div className="text-xs text-muted-foreground">Unscheduled</div>
            </div>
          </div>

          {/* 6-Month Trend */}
          <div className="overflow-y-auto max-h-48">
            <h4 className="text-sm font-medium mb-3">6-Month Maintenance Trend</h4>
            <div className="space-y-3">
              {data.slice(-6).map((month, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{month.month}</span>
                    <span className="text-muted-foreground">
                      {month.scheduled + month.unscheduled} total
                    </span>
                  </div>
                  <div className="flex space-x-1 h-2">
                    <div 
                      className="bg-emerald-500 rounded-l"
                      style={{ width: `${(month.scheduled / maxValue) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500 rounded-r"
                      style={{ width: `${(month.unscheduled / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>Unscheduled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceChart;