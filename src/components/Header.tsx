import React from 'react';
import { Activity, User, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alarm } from '../types';

interface HeaderProps {
  alarms: Alarm[];
  onNotificationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ alarms, onNotificationClick }) => {
  const currentTime = new Date().toLocaleString();
  const unacknowledgedCount = alarms.filter(alarm => !alarm.acknowledged && alarm.status === 'active').length;

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Asset Performance Hub</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Operations Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm font-medium text-foreground">{currentTime}</p>
            <p className="text-xs text-muted-foreground">Local Time</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onNotificationClick}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {unacknowledgedCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unacknowledgedCount > 99 ? '99+' : unacknowledgedCount}
                  </Badge>
                )}
              </Button>
            </div>
            
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;