import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RevenueData } from '../types';

interface RevenueChartProps {
  data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.target)));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalTarget = data.reduce((sum, d) => sum + d.target, 0);
  const performance = ((totalRevenue / totalTarget) * 100).toFixed(1);
  
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const growth = ((latest.revenue - previous.revenue) / previous.revenue * 100).toFixed(1);

  return (
    <Card className="backdrop-blur-sm flex flex-col w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Revenue Performance</span>
          </CardTitle>
          <Badge variant={parseFloat(growth) > 0 ? 'default' : 'destructive'} className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{growth}%</span>
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          YTD Performance: {performance}% of target
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">
                ${(totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-muted-foreground">
                ${(totalTarget / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Target</div>
            </div>
          </div>

          {/* Monthly Performance Chart */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Monthly Performance</span>
            </h4>
            <div className="space-y-3">
              {data.map((month, index) => {
                const achievementRate = (month.revenue / month.target) * 100;
                const isAboveTarget = month.revenue > month.target;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{month.period}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          ${(month.revenue / 1000).toFixed(0)}K
                        </span>
                        <Badge 
                          variant={isAboveTarget ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {achievementRate.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isAboveTarget ? 'bg-emerald-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min((month.revenue / maxValue) * 100, 100)}%` }}
                        />
                      </div>
                      {/* Target indicator */}
                      <div 
                        className="absolute top-0 w-0.5 h-3 bg-foreground/50 rounded-full"
                        style={{ left: `${(month.target / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Above Target</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Below Target</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-0.5 h-3 bg-foreground/50 rounded-full"></div>
              <span>Target Line</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;