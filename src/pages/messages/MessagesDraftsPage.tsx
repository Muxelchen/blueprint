import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Search, Filter, Clock, Trash2, Send } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const MessagesDraftsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');

  const draftMessages = [
    {
      id: 1,
      recipient: 'alice.smith@example.com',
      subject: 'Quarterly Performance Review',
      preview: 'Hi Alice, I wanted to schedule time to discuss your quarterly performance...',
      lastModified: '2024-01-15T16:45:00Z',
      completeness: 85
    },
    {
      id: 2,
      recipient: '',
      subject: 'Team Building Event Planning',
      preview: 'Team, I\'ve been thinking about organizing a team building event...',
      lastModified: '2024-01-15T14:20:00Z',
      completeness: 60
    },
    {
      id: 3,
      recipient: 'hr@company.com',
      subject: 'Vacation Request - March',
      preview: 'I would like to request vacation time for the following dates in March...',
      lastModified: '2024-01-15T10:30:00Z',
      completeness: 90
    },
    {
      id: 4,
      recipient: 'client@example.com',
      subject: '',
      preview: 'Thank you for your interest in our services. I wanted to follow up...',
      lastModified: '2024-01-14T18:15:00Z',
      completeness: 40
    },
    {
      id: 5,
      recipient: 'vendor@supplier.com',
      subject: 'Contract Renewal Discussion',
      preview: 'As we approach the end of our current contract term, I wanted to discuss...',
      lastModified: '2024-01-14T11:00:00Z',
      completeness: 75
    }
  ];

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-500';
    if (completeness >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCompletenessBarColor = (completeness: number) => {
    if (completeness >= 80) return 'bg-green-500';
    if (completeness >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
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
              Draft Messages
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Continue working on unsent messages
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="btn-primary">
              <Edit3 className="w-4 h-4 mr-2" />
              New Draft
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
            placeholder="Search draft messages..."
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

      {/* Drafts List */}
      <div className="space-y-3">
        {draftMessages.map((draft, index) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            } transition-colors`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {draft.subject || 'Untitled Draft'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getCompletenessColor(draft.completeness)}`}>
                        {draft.completeness}% complete
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    To: {draft.recipient || 'No recipient'}
                  </div>
                  
                  <p className={`text-sm line-clamp-2 mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {draft.preview}
                  </p>
                  
                  {/* Completeness Bar */}
                  <div className="mb-3">
                    <div className={`h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${getCompletenessBarColor(draft.completeness)}`}
                        style={{ width: `${draft.completeness}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                        Last edited: {new Date(draft.lastModified).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className={`p-2 rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors ${
                        draft.completeness < 80 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}>
                        <Send className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {draftMessages.length === 0 && (
        <div className="text-center py-12">
          <Edit3 className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No draft messages
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Your draft messages will appear here
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MessagesDraftsPage; 