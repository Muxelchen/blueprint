import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, Filter, Clock, CheckCircle } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const MessagesSentPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');

  const sentMessages = [
    {
      id: 1,
      recipient: 'alice.smith@example.com',
      subject: 'Project Update - Q1 Review',
      preview: 'Hi Alice, I wanted to provide you with an update on the Q1 project review...',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'delivered'
    },
    {
      id: 2,
      recipient: 'team@company.com',
      subject: 'Weekly Team Meeting Notes',
      preview: 'Team, here are the notes from our weekly meeting covering key action items...',
      timestamp: '2024-01-15T11:15:00Z',
      status: 'read'
    },
    {
      id: 3,
      recipient: 'bob.wilson@example.com',
      subject: 'Budget Approval Request',
      preview: 'Bob, I need your approval for the Q2 budget allocation for the new project...',
      timestamp: '2024-01-15T09:45:00Z',
      status: 'delivered'
    },
    {
      id: 4,
      recipient: 'support@vendor.com',
      subject: 'Technical Support Request',
      preview: 'We are experiencing issues with the API integration and need assistance...',
      timestamp: '2024-01-14T16:20:00Z',
      status: 'read'
    },
    {
      id: 5,
      recipient: 'carol.brown@example.com',
      subject: 'Meeting Reschedule',
      preview: 'Carol, I need to reschedule our meeting from tomorrow to next week...',
      timestamp: '2024-01-14T13:30:00Z',
      status: 'delivered'
    }
  ];

  const getStatusIcon = (status: string) => {
    return status === 'read' ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Send className="w-4 h-4 text-blue-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'read' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sent Messages
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View and manage sent messages
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search sent messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {sentMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            } transition-colors cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(message.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {message.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </div>
                  
                  <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    To: {message.recipient}
                  </div>
                  
                  <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {message.preview}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MessagesSentPage; 