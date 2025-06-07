import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  type?: 'recent' | 'trending' | 'suggestion';
  icon?: React.ReactNode;
}

export interface SearchBarProps {
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  debounceMs?: number;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  suggestions = [],
  recentSearches = [],
  value = '',
  onChange,
  onSearch,
  onSuggestionClick,
  onClear,
  disabled = false,
  autoFocus = false,
  showSuggestions = true,
  maxSuggestions = 8,
  debounceMs = 300,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Update internal state when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced onChange callback
  const debouncedOnChange = useCallback((newValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Filter suggestions based on input
  useEffect(() => {
    if (!inputValue.trim() || !showSuggestions) {
      // Show recent searches when input is empty
      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 3).map((search, index) => ({
        id: `recent-${index}`,
        title: search,
        type: 'recent' as const,
        icon: <Clock className="w-4 h-4" />,
      }));
      setFilteredSuggestions(recentSuggestions);
      return;
    }

    const query = inputValue.toLowerCase();
    const filtered = suggestions
      .filter(suggestion => 
        suggestion.title.toLowerCase().includes(query) ||
        suggestion.subtitle?.toLowerCase().includes(query) ||
        suggestion.category?.toLowerCase().includes(query)
      )
      .slice(0, maxSuggestions);

    setFilteredSuggestions(filtered);
  }, [inputValue, suggestions, recentSearches, maxSuggestions, showSuggestions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    setIsOpen(true);
    debouncedOnChange(newValue);
  };

  // Handle search submit
  const handleSearch = useCallback((query?: string) => {
    const searchQuery = query || inputValue;
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [inputValue, onSearch]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'recent') {
      setInputValue(suggestion.title);
      handleSearch(suggestion.title);
    } else {
      onSuggestionClick?.(suggestion);
    }
    setIsOpen(false);
  }, [onSuggestionClick, handleSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : -1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > -1 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clear
  const handleClear = () => {
    setInputValue('');
    setIsOpen(false);
    onClear?.();
    onChange?.('');
    inputRef.current?.focus();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;
    if (suggestion.type === 'recent') return <Clock className="w-4 h-4" />;
    if (suggestion.type === 'trending') return <TrendingUp className="w-4 h-4" />;
    return <Search className="w-4 h-4" />;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 
            rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        />
        
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-colors duration-200 flex items-center gap-3
                ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900' : ''}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                {getSuggestionIcon(suggestion)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {suggestion.title}
                </div>
                {suggestion.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.subtitle}
                  </div>
                )}
              </div>
              {suggestion.category && (
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {suggestion.category}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 