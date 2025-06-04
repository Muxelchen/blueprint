import React, { useState } from 'react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'milestone' | 'task' | 'meeting' | 'release' | 'bug' | 'feature';
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  assignee?: string;
}

interface TimelineProps {
  events?: TimelineEvent[];
  title?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  title = 'Project Timeline'
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock timeline data
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Project Kickoff',
      description: 'Initial project planning and team assignments',
      date: new Date(2025, 4, 1), // May 1, 2025
      type: 'milestone',
      status: 'completed',
      assignee: 'John Doe'
    },
    {
      id: '2',
      title: 'UI Design Phase',
      description: 'Complete wireframes and mockups for dashboard',
      date: new Date(2025, 4, 15),
      type: 'task',
      status: 'completed',
      assignee: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Team Meeting',
      description: 'Weekly progress review and blockers discussion',
      date: new Date(2025, 5, 3),
      type: 'meeting',
      status: 'completed',
      assignee: 'Team Lead'
    },
    {
      id: '4',
      title: 'Backend API Development',
      description: 'Implement REST endpoints for dashboard data',
      date: new Date(2025, 5, 10),
      type: 'task',
      status: 'in-progress',
      assignee: 'Mike Johnson'
    },
    {
      id: '5',
      title: 'Bug Fix: Chart Rendering',
      description: 'Fix chart tooltips not displaying correctly',
      date: new Date(2025, 5, 12),
      type: 'bug',
      status: 'completed',
      assignee: 'Sarah Wilson'
    },
    {
      id: '6',
      title: 'Feature: Real-time Updates',
      description: 'Add WebSocket support for live data updates',
      date: new Date(2025, 5, 18),
      type: 'feature',
      status: 'in-progress',
      assignee: 'Alex Chen'
    },
    {
      id: '7',
      title: 'Beta Release',
      description: 'Deploy beta version to staging environment',
      date: new Date(2025, 5, 25),
      type: 'release',
      status: 'pending',
      assignee: 'DevOps Team'
    },
    {
      id: '8',
      title: 'User Testing',
      description: 'Collect feedback from beta users',
      date: new Date(2025, 6, 1),
      type: 'milestone',
      status: 'pending',
      assignee: 'QA Team'
    },
    {
      id: '9',
      title: 'Performance Optimization',
      description: 'Optimize chart rendering and data loading',
      date: new Date(2025, 6, 10),
      type: 'task',
      status: 'pending',
      assignee: 'Performance Team'
    },
    {
      id: '10',
      title: 'Production Release',
      description: 'Deploy final version to production',
      date: new Date(2025, 6, 20),
      type: 'release',
      status: 'pending',
      assignee: 'Release Manager'
    }
  ];

  const [events] = useState<TimelineEvent[]>(mockEvents);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-purple-500';
      case 'task': return 'bg-blue-500';
      case 'meeting': return 'bg-green-500';
      case 'release': return 'bg-red-500';
      case 'bug': return 'bg-orange-500';
      case 'feature': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'task': return '📝';
      case 'meeting': return '👥';
      case 'release': return '🚀';
      case 'bug': return '🐛';
      case 'feature': return '✨';
      default: return '📌';
    }
  };

  const filteredEvents = events
    .filter(event => selectedFilter === 'all' || event.type === selectedFilter)
    .sort((a, b) => {
      return sortOrder === 'desc' 
        ? b.date.getTime() - a.date.getTime()
        : a.date.getTime() - b.date.getTime();
    });

  const eventTypes = ['all', ...Array.from(new Set(events.map(e => e.type)))];
  const statusCounts = events.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isUpcoming = (date: Date) => {
    return date > new Date();
  };

  const isOverdue = (event: TimelineEvent) => {
    return event.date < new Date() && event.status !== 'completed';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {sortOrder === 'desc' ? '↓' : '↑'} Sort
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {eventTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedFilter(type)}
            className={`px-3 py-1 text-sm rounded-lg capitalize transition-colors ${
              selectedFilter === type 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'All Events' : type}
          </button>
        ))}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-900">{statusCounts.completed || 0}</div>
          <div className="text-xs text-green-600">Completed</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-900">{statusCounts['in-progress'] || 0}</div>
          <div className="text-xs text-blue-600">In Progress</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-900">{statusCounts.pending || 0}</div>
          <div className="text-xs text-yellow-600">Pending</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-900">{statusCounts.cancelled || 0}</div>
          <div className="text-xs text-red-600">Cancelled</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative flex items-start space-x-4">
              {/* Timeline dot */}
              <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full ${getTypeColor(event.type)} flex items-center justify-center`}>
                <span className="text-xs text-white">
                  {getTypeIcon(event.type)}
                </span>
              </div>
              
              {/* Event content */}
              <div className={`flex-1 bg-white border rounded-lg p-4 shadow-sm ${
                isOverdue(event) ? 'border-red-300 bg-red-50' : 
                isUpcoming(event.date) ? 'border-blue-300 bg-blue-50' : 
                'border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(event.status)}`}>
                    {event.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className="text-gray-500">
                      📅 {formatDate(event.date)}
                    </span>
                    {event.assignee && (
                      <span className="text-gray-500">
                        👤 {event.assignee}
                      </span>
                    )}
                  </div>
                  
                  {isOverdue(event) && (
                    <span className="text-red-600 text-xs font-medium">Overdue</span>
                  )}
                  {isUpcoming(event.date) && event.status === 'pending' && (
                    <span className="text-blue-600 text-xs font-medium">Upcoming</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium mb-3">Project Progress</h5>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{Math.round((statusCounts.completed || 0) / events.length * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(statusCounts.completed || 0) / events.length * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {statusCounts.completed || 0} of {events.length} completed
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-6">
        <h5 className="font-medium mb-3">Upcoming Deadlines</h5>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {events
            .filter(event => isUpcoming(event.date) && event.status !== 'completed')
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 3)
            .map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <span>{getTypeIcon(event.type)}</span>
                  <span className="text-sm font-medium">{event.title}</span>
                </div>
                <span className="text-xs text-gray-600">{formatDate(event.date)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;