import React from 'react';
import { X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Alarm } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: Alarm[];
  onAcknowledge: (alarmId: string) => void;
  onDismiss: (alarmId: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  alarms,
  onAcknowledge,
  onDismiss
}) => {
  if (!isOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const activeAlarms = alarms.filter(alarm => alarm.status === 'active');
  const unacknowledgedCount = activeAlarms.filter(alarm => !alarm.acknowledged).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>System Notifications</span>
              {unacknowledgedCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unacknowledgedCount} unacknowledged
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeAlarms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p>No active alerts</p>
                <p className="text-sm">All systems operating normally</p>
              </div>
            ) : (
              activeAlarms.map(alarm => (
                <Card
                  key={alarm.id}
                  className={cn(
                    "border transition-all",
                    getSeverityColor(alarm.severity),
                    alarm.acknowledged && "opacity-60"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityIcon(alarm.severity)}
                          <span className="font-medium text-foreground truncate">
                            {alarm.title}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize shrink-0">
                            {alarm.severity}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {alarm.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{alarm.assetName}</span>
                          <span>•</span>
                          <span>{formatTime(alarm.timestamp)}</span>
                          {alarm.acknowledged && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/20">
                                Acknowledged
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {!alarm.acknowledged && (
                          <Button
                            size="sm"
                            onClick={() => onAcknowledge(alarm.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDismiss(alarm.id)}
                          className="text-xs"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationModal;