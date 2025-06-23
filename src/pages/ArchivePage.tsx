import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Calendar, File, Folder, Download, Eye } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const ArchivePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const archivedItems = [
    {
      id: 1,
      name: 'Q4 2023 Marketing Campaign',
      type: 'project',
      size: '156 MB',
      archivedDate: new Date('2024-01-15'),
      items: 45,
      description: 'Complete marketing assets and analytics',
    },
    {
      id: 2,
      name: 'Legacy User Interface',
      type: 'design',
      size: '89 MB',
      archivedDate: new Date('2024-02-01'),
      items: 23,
      description: 'Old UI components and design files',
    },
    {
      id: 3,
      name: 'Database Backup - Dec 2023',
      type: 'backup',
      size: '2.3 GB',
      archivedDate: new Date('2024-01-01'),
      items: 1,
      description: 'Full database backup before migration',
    },
    {
      id: 4,
      name: 'Employee Training Videos',
      type: 'media',
      size: '890 MB',
      archivedDate: new Date('2023-12-20'),
      items: 12,
      description: 'Onboarding and training materials',
    },
  ];

  const filters = [
    { id: 'all', name: 'All Items', count: archivedItems.length },
    { id: 'project', name: 'Projects', count: archivedItems.filter(i => i.type === 'project').length },
    { id: 'design', name: 'Design Files', count: archivedItems.filter(i => i.type === 'design').length },
    { id: 'backup', name: 'Backups', count: archivedItems.filter(i => i.type === 'backup').length },
    { id: 'media', name: 'Media', count: archivedItems.filter(i => i.type === 'media').length },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Folder className="w-6 h-6 text-blue-500" />;
      case 'design':
        return <File className="w-6 h-6 text-purple-500" />;
      case 'backup':
        return <Archive className="w-6 h-6 text-green-500" />;
      case 'media':
        return <File className="w-6 h-6 text-orange-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const filteredItems = archivedItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalSize = archivedItems.reduce((acc, item) => {
    const size = parseFloat(item.size.split(' ')[0]);
    const unit = item.size.split(' ')[1];
    if (unit === 'GB') return acc + size * 1024;
    return acc + size;
  }, 0);

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
              Archive
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Access archived projects and old files
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total: {(totalSize / 1024).toFixed(1)} GB
            </div>
            <button className="btn-primary">
              <Archive className="w-4 h-4 mr-2" />
              Archive Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            <Archive className="w-8 h-8 text-blue-500" />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Items
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {archivedItems.length}
              </p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            <Folder className="w-8 h-8 text-green-500" />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Projects
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {archivedItems.filter(i => i.type === 'project').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            <File className="w-8 h-8 text-purple-500" />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Size
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {(totalSize / 1024).toFixed(1)} GB
              </p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This Month
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {filter.name} ({filter.count})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-primary-500`}
          />
        </div>
      </div>

      {/* Archive Items */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getTypeIcon(item.type)}
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                  <div className={`flex items-center space-x-4 mt-2 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    <span>Size: {item.size}</span>
                    <span>Items: {item.items}</span>
                    <span>Archived: {item.archivedDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  <Eye className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No archived items found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      )}
    </motion.div>
  );
};

export default ArchivePage; 