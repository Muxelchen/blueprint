import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Star, Link, Folder, Search, Tag, Plus } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const BookmarksPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bookmarks = [
    {
      id: 1,
      title: 'React Documentation',
      url: 'https://react.dev',
      description: 'Official React documentation and guides',
      category: 'development',
      tags: ['react', 'javascript', 'frontend'],
      starred: true,
      addedDate: new Date('2024-03-01'),
    },
    {
      id: 2,
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: 'Utility-first CSS framework',
      category: 'design',
      tags: ['css', 'styling', 'framework'],
      starred: false,
      addedDate: new Date('2024-03-02'),
    },
    {
      id: 3,
      title: 'TypeScript Handbook',
      url: 'https://typescriptlang.org/docs',
      description: 'Complete guide to TypeScript',
      category: 'development',
      tags: ['typescript', 'javascript'],
      starred: true,
      addedDate: new Date('2024-03-03'),
    },
  ];

  const categories = [
    { id: 'all', name: 'All Bookmarks', icon: Bookmark, count: bookmarks.length },
    { id: 'starred', name: 'Starred', icon: Star, count: bookmarks.filter(b => b.starred).length },
    { id: 'development', name: 'Development', icon: Folder, count: bookmarks.filter(b => b.category === 'development').length },
    { id: 'design', name: 'Design', icon: Folder, count: bookmarks.filter(b => b.category === 'design').length },
  ];

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesCategory = selectedCategory === 'all' || 
                          (selectedCategory === 'starred' && bookmark.starred) ||
                          bookmark.category === selectedCategory;
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              Bookmarks
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Organize and manage your saved links
            </p>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Bookmark
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-primary-500`}
              />
            </div>
          </div>

          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Link className="w-5 h-5 text-blue-500" />
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {bookmark.title}
                    </h3>
                  </div>
                  <button className={`p-1 rounded ${
                    bookmark.starred ? 'text-yellow-500' : 'text-gray-400'
                  } hover:text-yellow-500 transition-colors`}>
                    <Star className={`w-4 h-4 ${bookmark.starred ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {bookmark.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {bookmark.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Added {bookmark.addedDate.toLocaleDateString()}
                  </span>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredBookmarks.length === 0 && (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookmarks found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookmarksPage; 