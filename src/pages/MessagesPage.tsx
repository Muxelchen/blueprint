import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Star } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

// Mock data
const mockConversations = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
    lastMessage: 'Looking forward to the meeting tomorrow!',
    timestamp: new Date('2024-03-10T14:30:00'),
    unread: 2,
    status: 'online',
  },
  {
    id: '2',
    name: 'Development Team',
    avatar: '👥',
    lastMessage: 'The new feature is ready for review',
    timestamp: new Date('2024-03-10T13:15:00'),
    unread: 0,
    status: 'active',
    isGroup: true,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    avatar: '👨‍💻',
    lastMessage: 'Thanks for the quick fix!',
    timestamp: new Date('2024-03-10T11:20:00'),
    unread: 0,
    status: 'away',
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'Alice Johnson',
    content: 'Hey! How\'s the project coming along?',
    timestamp: new Date('2024-03-10T14:25:00'),
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    content: 'Going great! Just finished the dashboard component.',
    timestamp: new Date('2024-03-10T14:26:00'),
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Alice Johnson',
    content: 'Awesome! Looking forward to the meeting tomorrow to see the progress.',
    timestamp: new Date('2024-03-10T14:30:00'),
    isOwn: false,
  },
];

const MessagesPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logic to send message would go here
      setNewMessage('');
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Messages
        </h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Connect with your team and stay in touch
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className={`rounded-lg border overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm`} style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className={`w-80 border-r ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex flex-col`}>
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversation.id === conversation.id
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {conversation.avatar}
                      </div>
                      {conversation.status === 'online' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {conversation.name}
                        </p>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {conversation.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className={`p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedConversation.name}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedConversation.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <Phone className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <Video className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-primary-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn 
                        ? 'text-primary-100' 
                        : isDarkMode 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-600 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}>
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-lg transition-colors ${
                    newMessage.trim()
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPage; 