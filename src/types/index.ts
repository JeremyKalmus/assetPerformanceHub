export interface KPIData {
  label: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  status: 'good' | 'warning' | 'critical';
}

export interface RevenueData {
  period: string;
  revenue: number;
  target: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  assetId: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'warning' | 'critical' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  lastUpdate: string;
}

export interface Alarm {
  id: string;
  assetId: string;
  assetName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  status: 'active' | 'resolved';
}

export interface Site {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  assets: Asset[];
  status: 'operational' | 'warning' | 'critical' | 'offline';
  latestAlarm?: Alarm;
  capacity: number; // MW
  currentOutput: number; // MW
  efficiency: number; // percentage
}

export interface EnergyData {
  date: string;
  solar: number;
  wind: number;
  hydro: number;
}

export interface MaintenanceData {
  month: string;
  scheduled: number;
  unscheduled: number;
  cost: number;
}

export interface PerformanceMetric {
  category: string;
  current: number;
  target: number;
  previous: number;
}