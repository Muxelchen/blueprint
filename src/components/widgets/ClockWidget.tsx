import React, { useState, useEffect } from 'react';
import { Clock, Globe, Settings, Calendar } from 'lucide-react';

interface TimeZoneConfig {
  label: string;
  timezone: string;
  abbreviation?: string;
}

interface ClockWidgetProps {
  title?: string;
  timezone?: string;
  format?: '12h' | '24h';
  showSeconds?: boolean;
  showDate?: boolean;
  showTimezone?: boolean;
  showMultipleTimezones?: boolean;
  additionalTimezones?: TimeZoneConfig[];
  updateInterval?: number; // in milliseconds
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
  digitalStyle?: boolean;
  showSettings?: boolean;
}

const defaultTimezones: TimeZoneConfig[] = [
  { label: 'New York', timezone: 'America/New_York', abbreviation: 'EST/EDT' },
  { label: 'London', timezone: 'Europe/London', abbreviation: 'GMT/BST' },
  { label: 'Tokyo', timezone: 'Asia/Tokyo', abbreviation: 'JST' },
  { label: 'Sydney', timezone: 'Australia/Sydney', abbreviation: 'AEST/AEDT' },
  { label: 'Los Angeles', timezone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
];

const ClockWidget: React.FC<ClockWidgetProps> = ({
  title = 'Clock',
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  format = '12h',
  showSeconds = true,
  showDate = true,
  showTimezone = true,
  showMultipleTimezones = false,
  additionalTimezones = defaultTimezones,
  updateInterval = 1000,
  size = 'md',
  theme = 'light',
  className = '',
  digitalStyle = true,
  showSettings = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezones, setSelectedTimezones] = useState<TimeZoneConfig[]>(
    showMultipleTimezones ? additionalTimezones.slice(0, 3) : []
  );
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const formatTime = (date: Date, tz: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hour12: format === '12h',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatDate = (date: Date, tz: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const getTimezoneAbbreviation = (date: Date, tz: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: tz,
        timeZoneName: 'short',
      };
      
      const formatted = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
      const timeZonePart = formatted.find(part => part.type === 'timeZoneName');
      return timeZonePart?.value || tz;
    } catch {
      return tz;
    }
  };

  const addTimezone = (timezoneConfig: TimeZoneConfig) => {
    if (!selectedTimezones.find(tz => tz.timezone === timezoneConfig.timezone)) {
      setSelectedTimezones([...selectedTimezones, timezoneConfig]);
    }
  };

  const removeTimezone = (timezoneToRemove: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz.timezone !== timezoneToRemove));
  };

  const sizeClasses = {
    sm: {
      container: 'p-4',
      title: 'text-sm',
      time: digitalStyle ? 'text-2xl font-mono' : 'text-2xl',
      date: 'text-xs',
      timezone: 'text-xs',
      multiTime: 'text-lg font-mono',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'p-6',
      title: 'text-base',
      time: digitalStyle ? 'text-4xl font-mono' : 'text-4xl',
      date: 'text-sm',
      timezone: 'text-sm',
      multiTime: 'text-xl font-mono',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'p-8',
      title: 'text-lg',
      time: digitalStyle ? 'text-6xl font-mono' : 'text-6xl',
      date: 'text-base',
      timezone: 'text-base',
      multiTime: 'text-2xl font-mono',
      icon: 'w-6 h-6',
    },
  };

  const containerClass = `${className} ${
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  } border rounded-lg overflow-hidden ${sizeClasses[size].container}`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} ${sizeClasses[size].icon}`} />
          <h3 className={`font-semibold ${sizeClasses[size].title}`}>
            {title}
          </h3>
        </div>
        
        {showSettings && (
          <button
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className={`p-1 rounded hover:bg-opacity-20 ${
              theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
            }`}
            title="Settings"
          >
            <Settings className={sizeClasses[size].icon} />
          </button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettingsPanel && (
        <div className={`mb-4 p-4 border rounded ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <h4 className="font-medium mb-2">Add Timezone</h4>
          <div className="grid grid-cols-1 gap-2">
            {additionalTimezones
              .filter(tz => !selectedTimezones.find(selected => selected.timezone === tz.timezone))
              .map((timezoneConfig) => (
                <button
                  key={timezoneConfig.timezone}
                  onClick={() => addTimezone(timezoneConfig)}
                  className={`text-left p-2 rounded text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {timezoneConfig.label} ({timezoneConfig.abbreviation})
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Main Clock */}
      <div className="text-center mb-6">
        <div className={`${sizeClasses[size].time} font-bold ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        } mb-2`}>
          {formatTime(currentTime, timezone)}
        </div>
        
        {showDate && (
          <div className={`${sizeClasses[size].date} ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          } mb-2`}>
            {formatDate(currentTime, timezone)}
          </div>
        )}
        
        {showTimezone && (
          <div className={`${sizeClasses[size].timezone} ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {getTimezoneAbbreviation(currentTime, timezone)}
          </div>
        )}
      </div>

      {/* Multiple Timezones */}
      {showMultipleTimezones && selectedTimezones.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Globe className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ${sizeClasses[size].icon}`} />
            <h4 className={`font-medium ${sizeClasses[size].timezone}`}>
              Other Timezones
            </h4>
          </div>
          
          {selectedTimezones.map((timezoneConfig) => (
            <div
              key={timezoneConfig.timezone}
              className={`flex items-center justify-between p-3 border rounded ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${sizeClasses[size].timezone}`}>
                    {timezoneConfig.label}
                  </span>
                  {showSettings && (
                    <button
                      onClick={() => removeTimezone(timezoneConfig.timezone)}
                      className={`text-xs px-2 py-1 rounded ${
                        theme === 'dark' 
                          ? 'text-red-400 hover:bg-red-900/20' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className={`${sizeClasses[size].multiTime} font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatTime(currentTime, timezoneConfig.timezone)}
                </div>
                <div className={`${sizeClasses[size].timezone} ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {getTimezoneAbbreviation(currentTime, timezoneConfig.timezone)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Indicator */}
      <div className={`flex items-center justify-center mt-4 ${sizeClasses[size].timezone} ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
        <span>Live</span>
      </div>
    </div>
  );
};

export default ClockWidget; 