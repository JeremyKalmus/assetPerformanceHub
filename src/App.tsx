import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KPITiles from './components/KPITiles';
import TimeSeriesChart from './components/TimeSeriesChart';
import InteractiveMap from './components/InteractiveMap';
import NotificationModal from './components/NotificationModal';
import EnergyMixChart from './components/EnergyMixChart';
import MaintenanceChart from './components/MaintenanceChart';
import PerformanceMetrics from './components/PerformanceMetrics';
import RevenueChart from './components/RevenueChart';
import CapacityUtilization from './components/CapacityUtilization';
import { 
  kpiData, 
  alarms as initialAlarms, 
  sites, 
  generateTimeSeriesData,
  energyMixData,
  maintenanceData,
  performanceMetrics,
  revenueData,
  capacityUtilizationData
} from './data/mockData';
import { Alarm, TimeSeriesData } from './types';

function App() {
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    // Initial data load
    setTimeSeriesData(generateTimeSeriesData());

    // Simulate real-time data updates
    // Reduced frequency: update every 90 seconds instead of 5 seconds
    const interval = setInterval(() => {
      setTimeSeriesData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];
        const newValue = Math.random() * 100 + 50 + Math.sin(Date.now() * 0.001) * 20;
        
        newData.push({
          timestamp: new Date().toISOString(),
          value: newValue,
          assetId: 'turbine-01'
        });
        
        // Keep only last 50 points
        if (newData.length > 50) {
          newData.shift();
        }
        
        return newData;
      });
    }, 90000); // 90 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlarm = (alarmId: string) => {
    setAlarms(prevAlarms =>
      prevAlarms.map(alarm =>
        alarm.id === alarmId ? { ...alarm, acknowledged: true } : alarm
      )
    );
  };

  const handleDismissAlarm = (alarmId: string) => {
    setAlarms(prevAlarms =>
      prevAlarms.map(alarm =>
        alarm.id === alarmId ? { ...alarm, status: 'resolved' as const } : alarm
      )
    );
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleCreateTicket = (alarmId: string) => {
    const alarm = alarms.find(a => a.id === alarmId);
    if (alarm) {
      alert(`Creating maintenance ticket for: ${alarm.title}\nAsset: ${alarm.assetName}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header 
        alarms={alarms} 
        onNotificationClick={handleNotificationClick}
      />
      
      <main className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
        {/* KPI Section */}
        <section>
          <KPITiles data={kpiData} />
        </section>

        {/* Primary Charts Section - Live Data and Map */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 h-[400px]">
          <div className="flex">
            <TimeSeriesChart data={timeSeriesData} />
          </div>
          <div className="flex">
            <InteractiveMap sites={sites} />
          </div>
        </section>

        {/* Secondary Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 min-h-[400px]">
          <div className="flex">
            <EnergyMixChart data={energyMixData} />
          </div>
          <div className="flex">
            <MaintenanceChart data={maintenanceData} />
          </div>
          <div className="flex">
            <PerformanceMetrics data={performanceMetrics} />
          </div>
        </section>

        {/* Financial and Utilization Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[400px]">
          <div className="flex">
            <RevenueChart data={revenueData} />
          </div>
          <div className="flex">
            <CapacityUtilization data={capacityUtilizationData} />
          </div>
        </section>
      </main>
      
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        alarms={alarms}
        onAcknowledge={handleAcknowledgeAlarm}
        onDismiss={handleDismissAlarm}
      />
    </div>
  );
}

export default App;