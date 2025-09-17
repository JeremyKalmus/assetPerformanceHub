import { KPIData, Asset, Alarm, Site, TimeSeriesData, EnergyData, MaintenanceData, PerformanceMetric, UtilizationData, RevenueData } from '../types';

export const kpiData: KPIData[] = [
  {
    label: 'MTBF',
    value: 247.3,
    unit: 'hours',
    trend: 'up',
    trendValue: '+12.5%',
    status: 'good'
  },
  {
    label: 'Availability',
    value: 94.2,
    unit: '%',
    trend: 'down',
    trendValue: '-1.3%',
    status: 'warning'
  },
  {
    label: 'Energy Today',
    value: 1247.8,
    unit: 'MWh',
    trend: 'up',
    trendValue: '+8.7%',
    status: 'good'
  },
  {
    label: 'Revenue Today',
    value: '$847,250',
    trend: 'up',
    trendValue: '+15.2%',
    status: 'good'
  }
];

export const alarms: Alarm[] = [
  {
    id: '1',
    assetId: 'turbine-01',
    assetName: 'Wind Turbine 01',
    severity: 'critical',
    title: 'Generator Temperature Critical',
    description: 'Generator temperature exceeded 85°C threshold',
    timestamp: '2025-01-27T10:30:00Z',
    acknowledged: false,
    status: 'active'
  },
  {
    id: '2',
    assetId: 'turbine-03',
    assetName: 'Wind Turbine 03',
    severity: 'high',
    title: 'Vibration Levels High',
    description: 'Gearbox vibration levels above normal range',
    timestamp: '2025-01-27T09:15:00Z',
    acknowledged: false,
    status: 'active'
  },
  {
    id: '3',
    assetId: 'transformer-02',
    assetName: 'Main Transformer 02',
    severity: 'medium',
    title: 'Oil Level Low',
    description: 'Transformer oil level below recommended minimum',
    timestamp: '2025-01-27T08:45:00Z',
    acknowledged: true,
    status: 'active'
  }
];

export const sites: Site[] = [
  {
    id: 'site-1',
    name: 'Offshore Wind Farm Alpha',
    location: { lat: 54.9783, lng: 1.6178 },
    status: 'critical',
    assets: [],
    latestAlarm: alarms[0],
    capacity: 400,
    currentOutput: 180,
    efficiency: 45
  },
  {
    id: 'site-2',
    name: 'Desert Solar Complex',
    location: { lat: 36.7783, lng: -119.4179 },
    status: 'operational',
    assets: [],
    latestAlarm: undefined,
    capacity: 250,
    currentOutput: 235,
    efficiency: 94
  },
  {
    id: 'site-3',
    name: 'Mountain Wind Station',
    location: { lat: 39.7392, lng: -104.9903 },
    status: 'warning',
    assets: [],
    latestAlarm: alarms[1],
    capacity: 150,
    currentOutput: 120,
    efficiency: 80
  },
  {
    id: 'site-4',
    name: 'Coastal Solar Array',
    location: { lat: 33.4484, lng: -118.4695 },
    status: 'operational',
    assets: [],
    latestAlarm: undefined,
    capacity: 180,
    currentOutput: 165,
    efficiency: 92
  },
  {
    id: 'site-5',
    name: 'Prairie Wind Farm',
    location: { lat: 41.2524, lng: -95.9980 },
    status: 'operational',
    assets: [],
    latestAlarm: undefined,
    capacity: 320,
    currentOutput: 290,
    efficiency: 91
  },
  {
    id: 'site-6',
    name: 'Highland Hydro Plant',
    location: { lat: 46.8059, lng: -121.7269 },
    status: 'warning',
    assets: [],
    latestAlarm: alarms[2],
    capacity: 85,
    currentOutput: 70,
    efficiency: 82
  },
  {
    id: 'site-7',
    name: 'Valley Solar Farm',
    location: { lat: 37.4419, lng: -122.1430 },
    status: 'operational',
    assets: [],
    latestAlarm: undefined,
    capacity: 200,
    currentOutput: 185,
    efficiency: 93
  }
];

export const generateTimeSeriesData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000).toISOString();
    data.push({
      timestamp,
      value: Math.random() * 100 + 50 + Math.sin(i * 0.1) * 20,
      assetId: 'turbine-01'
    });
  }
  
  return data.reverse();
}

export const energyMixData: EnergyData[] = [
  {
    date: '2025-01-21',
    solar: 284.1,
    wind: 223.2,
    hydro: 59.5
  },
  {
    date: '2025-01-22',
    solar: 298.7,
    wind: 245.8,
    hydro: 61.2
  },
  {
    date: '2025-01-23',
    solar: 276.3,
    wind: 267.4,
    hydro: 58.8
  },
  {
    date: '2025-01-24',
    solar: 312.5,
    wind: 198.6,
    hydro: 62.1
  },
  {
    date: '2025-01-25',
    solar: 289.9,
    wind: 234.7,
    hydro: 60.3
  },
  {
    date: '2025-01-26',
    solar: 305.2,
    wind: 256.1,
    hydro: 59.7
  },
  {
    date: '2025-01-27',
    solar: 318.4,
    wind: 278.3,
    hydro: 61.8
  }
];

export const capacityUtilizationData: UtilizationData[] = [
  {
    siteId: 'site-1',
    siteName: 'Offshore Wind Farm Alpha',
    capacity: 400,
    currentOutput: 180,
    peakToday: 380,
    avgUtilization: 45,
    status: 'low'
  },
  {
    siteId: 'site-2',
    siteName: 'Desert Solar Complex',
    capacity: 250,
    currentOutput: 235,
    peakToday: 248,
    avgUtilization: 94,
    status: 'good'
  },
  {
    siteId: 'site-3',
    siteName: 'Mountain Wind Station',
    capacity: 150,
    currentOutput: 120,
    peakToday: 145,
    avgUtilization: 80,
    status: 'good'
  },
  {
    siteId: 'site-4',
    siteName: 'Coastal Solar Array',
    capacity: 180,
    currentOutput: 165,
    peakToday: 175,
    avgUtilization: 92,
    status: 'good'
  },
  {
    siteId: 'site-5',
    siteName: 'Prairie Wind Farm',
    capacity: 320,
    currentOutput: 290,
    peakToday: 315,
    avgUtilization: 91,
    status: 'good'
  }
];

export const maintenanceData: MaintenanceData[] = [
  {
    month: 'Jan',
    scheduled: 45000,
    unscheduled: 12000,
    total: 57000,
    cost: 57000
  },
  {
    month: 'Feb',
    scheduled: 38000,
    unscheduled: 8500,
    total: 46500,
    cost: 46500
  },
  {
    month: 'Mar',
    scheduled: 52000,
    unscheduled: 15000,
    total: 67000,
    cost: 67000
  },
  {
    month: 'Apr',
    scheduled: 41000,
    unscheduled: 9200,
    total: 50200,
    cost: 50200
  },
  {
    month: 'May',
    scheduled: 47000,
    unscheduled: 11800,
    total: 58800,
    cost: 58800
  },
  {
    month: 'Jun',
    scheduled: 43000,
    unscheduled: 7300,
    total: 50300,
    cost: 50300
  }
];

export const performanceMetrics: PerformanceMetric[] = [
  {
    id: '1',
    name: 'Overall Efficiency',
    current: 87.5,
    target: 90,
    unit: '%',
    trend: 'up',
    trendValue: '+2.3%',
    status: 'warning'
  },
  {
    id: '2',
    name: 'Uptime',
    current: 98.2,
    target: 99,
    unit: '%',
    trend: 'down',
    trendValue: '-0.5%',
    status: 'warning'
  },
  {
    id: '3',
    name: 'Energy Output',
    current: 1247.8,
    target: 1200,
    unit: 'MWh',
    trend: 'up',
    trendValue: '+8.7%',
    status: 'good'
  },
  {
    id: '4',
    name: 'Cost per MWh',
    current: 42.5,
    target: 45,
    unit: '$',
    trend: 'down',
    trendValue: '-5.6%',
    status: 'good'
  }
];

export const revenueData: RevenueData[] = [
  {
    period: 'Jan 2025',
    revenue: 2400000,
    target: 2200000
  },
  {
    period: 'Feb 2025',
    revenue: 2100000,
    target: 2300000
  },
  {
    period: 'Mar 2025',
    revenue: 2800000,
    target: 2500000
  },
  {
    period: 'Apr 2025',
    revenue: 2650000,
    target: 2600000
  },
  {
    period: 'May 2025',
    revenue: 2900000,
    target: 2700000
  },
  {
    period: 'Jun 2025',
    revenue: 3100000,
    target: 2800000
  }
];