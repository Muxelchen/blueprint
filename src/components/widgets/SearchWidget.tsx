import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Clock, Star, FileText, User, Settings, ArrowUpDown } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'user' | 'page' | 'widget' | 'other';
  url?: string;
  metadata?: Record<string, any>;
  lastModified?: Date;
  relevanceScore?: number;
}

interface SearchFilter {
  type?: string;
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  sortBy?: 'relevance' | 'date' | 'title';
  category?: string;
}

interface SearchWidgetProps {
  title?: string;
  placeholder?: string;
  data?: SearchResult[];
  onSearch?: (query: string, filters: SearchFilter) => Promise<SearchResult[]> | SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  showFilters?: boolean;
  showRecentSearches?: boolean;
  maxResults?: number;
  debounceMs?: number;
  theme?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  enableHighlighting?: boolean;
  showTypeIcons?: boolean;
}

const mockData: SearchResult[] = [
  {
    id: '1',
    title: 'Dashboard Analytics Report',
    content: 'Comprehensive analysis of dashboard performance metrics including user engagement, conversion rates, and revenue tracking.',
    type: 'document',
    url: '/analytics/dashboard-report',
    lastModified: new Date('2024-01-15'),
    relevanceScore: 0.95,
  },
  {
    id: '2',
    title: 'User Management System',
    content: 'Complete user management interface with role-based access control, permissions, and activity tracking.',
    type: 'page',
    url: '/users',
    lastModified: new Date('2024-01-10'),
    relevanceScore: 0.87,
  },
  {
    id: '3',
    title: 'Alice Johnson',
    content: 'Senior Developer, Frontend Team Lead, React specialist with 5+ years experience.',
    type: 'user',
    url: '/users/alice-johnson',
    lastModified: new Date('2024-01-12'),
    relevanceScore: 0.82,
  },
  {
    id: '4',
    title: 'Chart Widget Documentation',
    content: 'Complete guide for implementing and customizing chart widgets including line charts, bar charts, and pie charts.',
    type: 'document',
    url: '/docs/chart-widget',
    lastModified: new Date('2024-01-08'),
    relevanceScore: 0.78,
  },
  {
    id: '5',
    title: 'Revenue KPI Widget',
    content: 'Real-time revenue tracking widget with trend analysis, goal tracking, and export capabilities.',
    type: 'widget',
    url: '/widgets/revenue-kpi',
    lastModified: new Date('2024-01-14'),
    relevanceScore: 0.92,
  },
];

const SearchWidget: React.FC<SearchWidgetProps> = ({
  title = 'Search',
  placeholder = 'Search...',
  data = mockData,
  onSearch,
  onResultClick,
  showFilters = true,
  showRecentSearches = true,
  maxResults = 10,
  debounceMs = 300,
  theme = 'light',
  className = '',
  size = 'md',
  enableHighlighting = true,
  showTypeIcons = true
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    sortBy: 'relevance',
    dateRange: 'all'
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query, filters);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, filters, debounceMs]);

  const performSearch = async (searchQuery: string, searchFilters: SearchFilter) => {
    setIsLoading(true);
    
    try {
      let searchResults: SearchResult[];
      
      if (onSearch) {
        searchResults = await Promise.resolve(onSearch(searchQuery, searchFilters));
      } else {
        // Default search implementation
        searchResults = data.filter(item => {
          const matchesQuery = 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesType = !searchFilters.type || item.type === searchFilters.type;
          
          const matchesDate = !searchFilters.dateRange || searchFilters.dateRange === 'all' || (() => {
            if (!item.lastModified) return true;
            
            const now = new Date();
            const itemDate = item.lastModified;
            
            switch (searchFilters.dateRange) {
              case 'today':
                return itemDate.toDateString() === now.toDateString();
              case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return itemDate >= weekAgo;
              case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return itemDate >= monthAgo;
              case 'year':
                const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                return itemDate >= yearAgo;
              default:
                return true;
            }
          })();
          
          return matchesQuery && matchesType && matchesDate;
        });
      }
      
      // Sort results
      searchResults.sort((a, b) => {
        switch (searchFilters.sortBy) {
          case 'date':
            const dateA = a.lastModified?.getTime() || 0;
            const dateB = b.lastModified?.getTime() || 0;
            return dateB - dateA;
          case 'title':
            return a.title.localeCompare(b.title);
          case 'relevance':
          default:
            return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        }
      });
      
      setResults(searchResults.slice(0, maxResults));
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (!newQuery.trim()) {
      setShowResults(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    
    setShowResults(false);
    onResultClick?.(result);
  };

  const highlightText = (text: string, searchQuery: string) => {
    if (!enableHighlighting || !searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'widget':
        return <Settings className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-blue-600';
      case 'user':
        return 'text-green-600';
      case 'page':
        return 'text-purple-600';
      case 'widget':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const sizeClasses = {
    sm: {
      container: 'text-sm',
      input: 'px-3 py-2 text-sm',
      result: 'p-3',
      title: 'text-sm',
      content: 'text-xs',
    },
    md: {
      container: 'text-base',
      input: 'px-4 py-3 text-base',
      result: 'p-4',
      title: 'text-base',
      content: 'text-sm',
    },
    lg: {
      container: 'text-lg',
      input: 'px-5 py-4 text-lg',
      result: 'p-5',
      title: 'text-lg',
      content: 'text-base',
    },
  };

  const containerClass = `${className} ${
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  } border rounded-lg overflow-hidden ${sizeClasses[size].container}`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className="font-semibold">{title}</h3>
        </div>
        
        {showFilters && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`p-1 rounded hover:bg-opacity-20 ${
              theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-900'
            }`}
            title="Filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                className={`w-full px-3 py-2 border rounded text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Types</option>
                <option value="document">Documents</option>
                <option value="user">Users</option>
                <option value="page">Pages</option>
                <option value="widget">Widgets</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select
                value={filters.dateRange || 'all'}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className={`w-full px-3 py-2 border rounded text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className={`w-full px-3 py-2 border rounded text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative p-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
              sizeClasses[size].input
            } ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {showRecentSearches && !query && recentSearches.length > 0 && (
          <div className="mt-3">
            <div className={`flex items-center space-x-2 mb-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((recentQuery, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(recentQuery)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {recentQuery}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-4 text-center">
          <div className={`inline-flex items-center space-x-2 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Searching...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && !isLoading && (
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full text-left ${sizeClasses[size].result} border-b last:border-b-0 hover:bg-opacity-50 ${
                    theme === 'dark' 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {showTypeIcons && (
                      <div className={`mt-1 ${getTypeColor(result.type)}`}>
                        {getTypeIcon(result.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${sizeClasses[size].title} mb-1`}>
                        {highlightText(result.title, query)}
                      </div>
                      <div className={`${sizeClasses[size].content} ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      } line-clamp-2`}>
                        {highlightText(result.content, query)}
                      </div>
                      {result.lastModified && (
                        <div className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {result.lastModified.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <div>No results found for "{query}"</div>
              <div className="text-sm mt-1">Try adjusting your search terms or filters</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWidget;