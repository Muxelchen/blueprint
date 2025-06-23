import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Filter, Search, Users, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync and planning',
    start: new Date(2024, 2, 15, 10, 0),
    end: new Date(2024, 2, 15, 11, 0),
    type: 'meeting',
    attendees: 8,
    location: 'Conference Room A',
  },
  {
    id: '2',
    title: 'Product Demo',
    description: 'Showcase new features to stakeholders',
    start: new Date(2024, 2, 16, 14, 0),
    end: new Date(2024, 2, 16, 15, 30),
    type: 'presentation',
    attendees: 12,
    location: 'Main Hall',
  },
  {
    id: '3',
    title: 'Code Review',
    description: 'Review pull requests and discuss implementation',
    start: new Date(2024, 2, 17, 16, 0),
    end: new Date(2024, 2, 17, 17, 0),
    type: 'review',
    attendees: 4,
    location: 'Dev Room',
  },
];

// Event type colors
const eventTypeColors = {
  meeting: 'bg-blue-500',
  presentation: 'bg-green-500',
  review: 'bg-orange-500',
  deadline: 'bg-red-500',
  other: 'bg-purple-500',
};

// Quick stats component
const CalendarStats: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  
  const stats = [
    { label: 'Today\'s Events', value: 3, icon: Calendar, color: 'text-blue-500' },
    { label: 'This Week', value: 12, icon: Clock, color: 'text-green-500' },
    { label: 'Total Attendees', value: 24, icon: Users, color: 'text-orange-500' },
    { label: 'Locations', value: 6, icon: MapPin, color: 'text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          } shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Simple calendar view component
const SimpleCalendar: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const renderCalendarDays = () => {
    const days: JSX.Element[] = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 p-2">
        </div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && 
                     currentDate.getMonth() === today.getMonth() && 
                     currentDate.getFullYear() === today.getFullYear();
      
      const hasEvent = mockEvents.some(event => 
        event.start.getDate() === day &&
        event.start.getMonth() === currentDate.getMonth() &&
        event.start.getFullYear() === currentDate.getFullYear()
      );
      
      days.push(
        <div
          key={day}
          className={`h-12 p-2 text-sm cursor-pointer transition-colors rounded-lg ${
            isToday
              ? 'bg-primary-500 text-white'
              : hasEvent
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
          {hasEvent && (
            <div className="w-1 h-1 bg-current rounded-full mx-auto mt-1"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className={`rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } shadow-sm p-6`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

// Event list component
const EventList: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } shadow-sm`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Upcoming Events
          </h3>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {mockEvents.map((event) => (
          <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-start space-x-4">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                eventTypeColors[event.type as keyof typeof eventTypeColors] || 'bg-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {event.title}
                </h4>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {event.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {event.attendees} attendees
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Calendar
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Manage your events and schedule
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View mode toggle */}
            <div className={`flex rounded-lg border ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-300 bg-white'
            }`}>
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    viewMode === mode
                      ? 'bg-primary-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Search and filter */}
            <div className="flex space-x-2">
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <Search className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Stats */}
      <CalendarStats />

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <SimpleCalendar />
        </div>

        {/* Event List Sidebar */}
        <div className="xl:col-span-1">
          <EventList />
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPage; 