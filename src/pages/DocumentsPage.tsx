import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Search, Filter, Download, MoreHorizontal, Folder, File, Image, Video } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const mockDocuments = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: '2.4 MB',
    modified: new Date('2024-03-10'),
    owner: 'John Doe',
    folder: 'Projects',
    shared: true,
  },
  {
    id: '2',
    name: 'Dashboard Screenshots',
    type: 'folder',
    items: 12,
    modified: new Date('2024-03-09'),
    owner: 'Alice Smith',
    folder: 'Media',
    shared: false,
  },
  {
    id: '3',
    name: 'Meeting Notes.docx',
    type: 'document',
    size: '156 KB',
    modified: new Date('2024-03-08'),
    owner: 'Bob Wilson',
    folder: 'Documents',
    shared: true,
  },
  {
    id: '4',
    name: 'Product Demo.mp4',
    type: 'video',
    size: '45.2 MB',
    modified: new Date('2024-03-07'),
    owner: 'Carol Brown',
    folder: 'Media',
    shared: false,
  },
];

const DocumentsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         doc.type === selectedFilter ||
                         (selectedFilter === 'shared' && doc.shared) ||
                         (selectedFilter === 'recent' && new Date().getTime() - doc.modified.getTime() < 7 * 24 * 60 * 60 * 1000);
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-8 h-8 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'document':
        return <File className="w-8 h-8 text-blue-600" />;
      case 'video':
        return <Video className="w-8 h-8 text-purple-500" />;
      case 'image':
        return <Image className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

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
              Documents
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Manage your files and folders
            </p>
          </div>
          
          <button className="btn-primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {[
            { name: 'All', value: 'all' },
            { name: 'Recent', value: 'recent' },
            { name: 'Shared', value: 'shared' },
            { name: 'Folders', value: 'folder' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.value
                  ? 'bg-primary-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className={`flex rounded-lg border ${
          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
        }`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-l-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-500 text-white'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-r-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Documents */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              } shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                {getFileIcon(doc.type)}
                <button className={`p-1 rounded transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className={`font-medium mb-2 truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {doc.name}
              </h3>
              
              <div className={`text-sm space-y-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>{doc.type === 'folder' ? `${doc.items} items` : doc.size}</p>
                <p>Modified {doc.modified.toLocaleDateString()}</p>
                <p>By {doc.owner}</p>
              </div>
              
              {doc.shared && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  Shared
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm overflow-hidden`}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(doc.type)}
                    <div>
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {doc.name}
                      </h3>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {doc.type === 'folder' ? `${doc.items} items` : doc.size} • 
                        Modified {doc.modified.toLocaleDateString()} • 
                        By {doc.owner}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {doc.shared && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                        Shared
                      </span>
                    )}
                    <button className={`p-1 rounded transition-colors ${
                      isDarkMode
                        ? 'hover:bg-gray-600 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className={`p-1 rounded transition-colors ${
                      isDarkMode
                        ? 'hover:bg-gray-600 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className={`w-12 h-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            No documents found
          </h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Try adjusting your search or upload some files.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentsPage; 