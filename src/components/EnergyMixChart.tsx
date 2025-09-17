import React from 'react';
import { BarChart3, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyData } from '../types';

interface EnergyMixChartProps {
  data: EnergyData[];
}

const EnergyMixChart: React.FC<EnergyMixChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.solar + d.wind + d.hydro));
  const latest = data[data.length - 1];
  const total = latest.solar + latest.wind + latest.hydro;

  return (
    <Card className="backdrop-blur-sm flex flex-col w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold">Energy Mix Distribution</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Total Generation: {total.toFixed(1)} MWh
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <div className="space-y-4">
          {/* Solar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Solar</span>
              <span className="text-sm text-muted-foreground">
                {latest.solar.toFixed(1)} MWh ({((latest.solar / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(latest.solar / maxValue) * 100}%` }}
              />
            </div>
          </div>

          {/* Wind */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Wind</span>
              <span className="text-sm text-muted-foreground">
                {latest.wind.toFixed(1)} MWh ({((latest.wind / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(latest.wind / maxValue) * 100}%` }}
              />
            </div>
          </div>

          {/* Hydro */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hydro</span>
              <span className="text-sm text-muted-foreground">
                {latest.hydro.toFixed(1)} MWh ({((latest.hydro / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(latest.hydro / maxValue) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7-day trend */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">7-Day Trend</h4>
          <div className="h-20 flex items-end space-x-1">
            {data.slice(-7).map((day, index) => {
              const dayTotal = day.solar + day.wind + day.hydro;
              const height = (dayTotal / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary/20 rounded-t transition-all duration-300 hover:bg-primary/30"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyMixChart;