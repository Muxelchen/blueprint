import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Star, 
  ArrowUpRight,
  Filter,
  Command,
  Hash,
  User,
  FileText,
  Folder,
  Settings,
  BarChart3,
  Map,
  Calendar,
  Mail
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'page' | 'user' | 'document' | 'project' | 'command'
  href: string
  icon: React.ComponentType<any>
  category: string
  score: number
  recentlyViewed?: boolean
  trending?: boolean
}

interface SearchBarProps {
  className?: string
  placeholder?: string
  showFilters?: boolean
  onSearch?: (query: string, results: SearchResult[]) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Search...',
  showFilters = true,
  onSearch
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  
  const searchRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Mock data for search results
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and metrics',
      type: 'page',
      href: '/analytics',
      icon: BarChart3,
      category: 'Pages',
      score: 0.9,
      trending: true
    },
    {
      id: '2',
      title: 'Interactive Map',
      description: 'Explore data visualization on maps',
      type: 'page',
      href: '/map',
      icon: Map,
      category: 'Pages',
      score: 0.8
    },
    {
      id: '3',
      title: 'John Doe',
      description: 'Administrator • john@example.com',
      type: 'user',
      href: '/users/john-doe',
      icon: User,
      category: 'Users',
      score: 0.7,
      recentlyViewed: true
    },
    {
      id: '4',
      title: 'Settings',
      description: 'Manage your account and preferences',
      type: 'page',
      href: '/settings',
      icon: Settings,
      category: 'Pages',
      score: 0.6
    },
    {
      id: '5',
      title: 'Calendar Events',
      description: 'Manage your schedule and appointments',
      type: 'page',
      href: '/calendar',
      icon: Calendar,
      category: 'Pages',
      score: 0.5
    },
    {
      id: '6',
      title: 'Project Blueprint',
      description: 'Frontend development project',
      type: 'project',
      href: '/projects/blueprint',
      icon: Folder,
      category: 'Projects',
      score: 0.8,
      trending: true
    },
    {
      id: '7',
      title: 'API Documentation',
      description: 'Complete API reference and guides',
      type: 'document',
      href: '/docs/api',
      icon: FileText,
      category: 'Documents',
      score: 0.7
    },
    {
      id: '8',
      title: 'Messages',
      description: 'View and manage your messages',
      type: 'page',
      href: '/messages',
      icon: Mail,
      category: 'Pages',
      score: 0.6
    }
  ]

  // Filter options
  const filters = [
    { key: 'all', label: 'All', icon: Search },
    { key: 'pages', label: 'Pages', icon: Hash },
    { key: 'users', label: 'Users', icon: User },
    { key: 'documents', label: 'Docs', icon: FileText },
    { key: 'projects', label: 'Projects', icon: Folder }
  ]

  // Search function with debouncing
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      const filteredResults = mockData
        .filter(item => {
          const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesFilter = activeFilter === 'all' || 
                               (activeFilter === 'pages' && item.type === 'page') ||
                               (activeFilter === 'users' && item.type === 'user') ||
                               (activeFilter === 'documents' && item.type === 'document') ||
                               (activeFilter === 'projects' && item.type === 'project')
          return matchesQuery && matchesFilter
        })
        .sort((a, b) => {
          // Sort by score, trending, and recently viewed
          if (a.trending && !b.trending) return -1
          if (!a.trending && b.trending) return 1
          if (a.recentlyViewed && !b.recentlyViewed) return -1
          if (!a.recentlyViewed && b.recentlyViewed) return 1
          return b.score - a.score
        })
        .slice(0, 8)

      setResults(filteredResults)
      setSelectedIndex(0)
      setIsLoading(false)
      
      // Call onSearch callback if provided
      onSearch?.(searchQuery, filteredResults)
    }, 300)
  }, [activeFilter, onSearch])

  // Handle input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev === 0 ? Math.max(results.length - 1, 0) : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        searchRef.current?.blur()
        break
    }
  }

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => [
      query,
      ...prev.filter(item => item !== query).slice(0, 4)
    ])
    
    setQuery('')
    setIsOpen(false)
    navigate(result.href)
  }

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
    performSearch(searchTerm)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const hasResults = results.length > 0
  const showRecentSearches = !query && recentSearches.length > 0

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setResults([])
              }}
              className="p-1 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <div className="hidden sm:flex items-center space-x-1 text-xs text-secondary-500 border border-secondary-200 rounded px-2 py-1">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-secondary-200 shadow-lg z-50 max-h-96 overflow-hidden"
          >
            {/* Filters */}
            {showFilters && (
              <div className="p-3 border-b border-secondary-200">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-secondary-500" />
                  <div className="flex items-center space-x-1">
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activeFilter === filter.key
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-secondary-600 hover:bg-secondary-100'
                        }`}
                      >
                        <filter.icon className="w-3 h-3 mr-1.5" />
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent mx-auto"></div>
                <p className="text-sm text-secondary-500 mt-2">Searching...</p>
              </div>
            )}

            {/* Recent Searches */}
            {showRecentSearches && !isLoading && (
              <div className="p-3">
                <h4 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((searchTerm, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(searchTerm)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                    >
                      {searchTerm}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {hasResults && !isLoading && (
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleResultClick(result)}
                    className={`w-full text-left px-4 py-3 border-b border-secondary-100 last:border-b-0 transition-colors ${
                      selectedIndex === index ? 'bg-primary-50' : 'hover:bg-secondary-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedIndex === index ? 'bg-primary-100' : 'bg-secondary-100'
                      }`}>
                        <result.icon className="w-4 h-4 text-secondary-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-secondary-900 truncate">
                            {result.title}
                          </h4>
                          {result.trending && (
                            <div className="flex items-center text-xs text-success-600">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              <span>Trending</span>
                            </div>
                          )}
                          {result.recentlyViewed && (
                            <div className="flex items-center text-xs text-primary-600">
                              <Star className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-secondary-500 truncate">
                          {result.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-secondary-400">{result.category}</span>
                          <ArrowUpRight className="w-3 h-3 text-secondary-400" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query && !hasResults && !isLoading && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Search className="w-6 h-6 text-secondary-400" />
                </div>
                <p className="text-sm font-medium text-secondary-600">No results found</p>
                <p className="text-xs text-secondary-500 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar