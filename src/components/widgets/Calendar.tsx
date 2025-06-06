import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'deadline' | 'event' | 'reminder';
  description?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'auto';
  compact?: boolean;
  height?: number;
  showUpcoming?: boolean;
  showStats?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  title = 'Calendar Widget',
  size = 'auto',
  compact = false,
  height,
  showUpcoming = true,
  showStats = true
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Mock events data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(2025, 5, 10), // June 10, 2025
      type: 'meeting',
      description: 'Weekly team sync'
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: new Date(2025, 5, 15),
      type: 'deadline',
      description: 'Dashboard project due'
    },
    {
      id: '3',
      title: 'Conference',
      date: new Date(2025, 5, 20),
      type: 'event',
      description: 'Tech conference'
    },
    {
      id: '4',
      title: 'Code Review',
      date: new Date(2025, 5, 8),
      type: 'meeting',
      description: 'Review pull requests'
    },
    {
      id: '5',
      title: 'Backup Reminder',
      date: new Date(2025, 5, 25),
      type: 'reminder',
      description: 'Monthly backup'
    }
  ];

  const [events] = useState<CalendarEvent[]>(mockEvents);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const maxEventsToShow = compact ? 1 : Math.floor((dimensions.cellHeight - 30) / 20); // Calculate based on cell height

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className={`${compact ? 'p-0.5' : 'p-1'} border border-gray-200`}
          style={{ height: `${dimensions.cellHeight}px` }}
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const todayClass = isToday(date) ? 'bg-blue-100 border-blue-500' : '';
      const selectedClass = isSelected ? 'bg-blue-200 border-blue-600' : '';

      days.push(
        <div
          key={day}
          className={`${compact ? 'p-0.5' : 'p-1'} border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${todayClass} ${selectedClass}`}
          onClick={() => setSelectedDate(date)}
          style={{ height: `${dimensions.cellHeight}px` }}
        >
          <div className="flex flex-col h-full">
            <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium ${isToday(date) ? 'text-blue-700' : 'text-gray-700'}`}>
              {day}
            </span>
            <div className="flex-1 overflow-hidden">
              {dayEvents.slice(0, maxEventsToShow).map((event) => (
                <div
                  key={event.id}
                  className={`${compact ? 'text-xs' : 'text-xs'} p-1 rounded truncate mb-1 ${
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                    event.type === 'event' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {compact ? event.title.slice(0, 8) + (event.title.length > 8 ? '...' : '') : event.title}
                </div>
              ))}
              {dayEvents.length > maxEventsToShow && (
                <div className={`${compact ? 'text-xs' : 'text-xs'} text-gray-500`}>
                  +{dayEvents.length - maxEventsToShow} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'deadline': return 'bg-red-500';
      case 'event': return 'bg-green-500';
      case 'reminder': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Calculate adaptive dimensions based on content complexity
  const getAdaptiveDimensions = () => {
    const totalEvents = events.length;
    const currentMonthEvents = events.filter(event => 
      event.date.getMonth() === currentDate.getMonth() && 
      event.date.getFullYear() === currentDate.getFullYear()
    ).length;
    
    // Calculate event density per day
    const daysInMonth = getDaysInMonth(currentDate);
    const eventDensity = currentMonthEvents / daysInMonth;
    
    let cellHeight: number;
    let containerMinHeight: number;
    let upcomingEventsHeight: number;
    
    if (height) {
      // Use provided height if specified
      cellHeight = Math.max(60, Math.floor(height / 8)); // Account for headers
      containerMinHeight = height;
      upcomingEventsHeight = Math.min(160, height * 0.2);
    } else if (size === 'small' || compact) {
      cellHeight = Math.max(48, 48 + Math.floor(eventDensity * 20));
      containerMinHeight = 400;
      upcomingEventsHeight = 120;
    } else if (size === 'large') {
      cellHeight = Math.max(120, 120 + Math.floor(eventDensity * 40));
      containerMinHeight = 800;
      upcomingEventsHeight = 240;
    } else if (size === 'medium') {
      cellHeight = Math.max(80, 80 + Math.floor(eventDensity * 30));
      containerMinHeight = 600;
      upcomingEventsHeight = 180;
    } else {
      // Auto sizing based on event density
      const baseHeight = 70;
      const densityBonus = Math.min(eventDensity * 35, 50); // Max 50px bonus
      const totalEventsBonus = Math.min(totalEvents * 2, 30); // Max 30px bonus
      
      cellHeight = baseHeight + densityBonus + totalEventsBonus;
      containerMinHeight = (cellHeight * 6) + 200 + (showUpcoming ? 180 : 0) + (showStats ? 100 : 0);
      upcomingEventsHeight = Math.max(120, Math.min(totalEvents * 25, 200));
    }
    
    return {
      cellHeight: Math.max(cellHeight, compact ? 40 : 60),
      containerMinHeight: Math.max(containerMinHeight, compact ? 350 : 500),
      upcomingEventsHeight: showUpcoming ? upcomingEventsHeight : 0,
      calendarGridHeight: cellHeight * 6, // 6 rows max for month view
    };
  };

  const dimensions = getAdaptiveDimensions();

  return (
    <div 
      className={`bg-white ${compact ? 'p-3' : 'p-6'} rounded-lg shadow-lg`} 
      style={{ 
        minHeight: `${dimensions.containerMinHeight}px`,
        height: size === 'large' ? `${dimensions.containerMinHeight}px` : 'auto'
      }}
    >
      <div className={`flex justify-between items-center ${compact ? 'mb-3' : 'mb-6'}`}>
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold`}>{title}</h3>
        {!compact && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {viewMode === 'month' ? 'Week' : 'Month'} View
            </button>
          </div>
        )}
      </div>

      {/* Calendar Header */}
      <div className={`flex justify-between items-center ${compact ? 'mb-2' : 'mb-4'}`}>
        <button
          onClick={() => navigateMonth('prev')}
          className={`${compact ? 'p-1' : 'p-2'} hover:bg-gray-100 rounded-full transition-colors`}
        >
          ←
        </button>
        <h4 className={`${compact ? 'text-base' : 'text-xl'} font-semibold`}>
          {compact 
            ? `${monthNames[currentDate.getMonth()].slice(0, 3)} ${currentDate.getFullYear()}`
            : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
          }
        </h4>
        <button
          onClick={() => navigateMonth('next')}
          className={`${compact ? 'p-1' : 'p-2'} hover:bg-gray-100 rounded-full transition-colors`}
        >
          →
        </button>
      </div>

      {/* Day Headers */}
      <div className={`grid grid-cols-7 gap-0 ${compact ? 'mb-1' : 'mb-2'}`}>
        {dayNames.map(day => (
          <div key={day} className={`${compact ? 'p-1' : 'p-2'} text-center ${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-600 bg-gray-50`}>
            {compact ? day.slice(0, 1) : day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {renderCalendarDays()}
      </div>

      {/* Event Details */}
      {selectedDate && !compact && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-3">
            Events for {selectedDate.toLocaleDateString()}
          </h5>
          {getEventsForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 bg-white rounded">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-gray-600">{event.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No events scheduled</p>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      {showUpcoming && !compact && (
        <div className="mt-6">
          <h5 className="font-medium mb-3">Upcoming Events</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto" style={{ maxHeight: dimensions.upcomingEventsHeight }}>
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.date.toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-gray-500 capitalize">{event.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {showStats && (
        <div className={`${compact ? 'mt-3' : 'mt-6'} grid grid-cols-4 gap-${compact ? '2' : '4'} text-center`}>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-blue-900">
              {events.filter(e => e.type === 'meeting').length}
            </div>
            <div className="text-xs text-blue-600">Meetings</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-red-900">
              {events.filter(e => e.type === 'deadline').length}
            </div>
            <div className="text-xs text-red-600">Deadlines</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-green-900">
              {events.filter(e => e.type === 'event').length}
            </div>
            <div className="text-xs text-green-600">Events</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-yellow-900">
              {events.filter(e => e.type === 'reminder').length}
            </div>
            <div className="text-xs text-yellow-600">Reminders</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;