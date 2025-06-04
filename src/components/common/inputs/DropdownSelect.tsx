import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Search, X, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface DropdownSelectProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success' | 'warning';
  label?: string;
  description?: string;
  error?: string;
  maxHeight?: number;
  loading?: boolean;
  noOptionsText?: string;
  searchPlaceholder?: string;
  onChange?: (value: string | number | null) => void;
  onSearchChange?: (search: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  name?: string;
  id?: string;
}

export interface DropdownSelectState {
  isOpen: boolean;
  searchTerm: string;
  highlightedIndex: number;
  isFocused: boolean;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options = [],
  value: controlledValue,
  defaultValue,
  placeholder = 'Select an option...',
  disabled = false,
  required = false,
  searchable = true,
  clearable = true,
  size = 'md',
  variant = 'default',
  label,
  description,
  error,
  maxHeight = 200,
  loading = false,
  noOptionsText = 'No options found',
  searchPlaceholder = 'Search options...',
  onChange,
  onSearchChange,
  onOpen,
  onClose,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  name,
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;

  const [state, setState] = useState<DropdownSelectState>({
    isOpen: false,
    searchTerm: '',
    highlightedIndex: -1,
    isFocused: false
  });

  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    controlledValue ?? defaultValue ?? null
  );

  // Update selected value when controlled value changes
  useEffect(() => {
    if (isControlled) {
      setSelectedValue(controlledValue ?? null);
    }
  }, [controlledValue, isControlled]);

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    if (!state.searchTerm) return true;
    return option.label.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
           option.description?.toLowerCase().includes(state.searchTerm.toLowerCase());
  });

  // Group options if they have groups
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, SelectOption[]>);

  // Get selected option
  const selectedOption = options.find(option => option.value === selectedValue);

  // Handle option selection
  const handleSelect = useCallback((option: SelectOption) => {
    if (option.disabled) return;

    const newValue = option.value;
    
    if (!isControlled) {
      setSelectedValue(newValue);
    }

    setState(prev => ({
      ...prev,
      isOpen: false,
      searchTerm: '',
      highlightedIndex: -1
    }));

    onChange?.(newValue);
    onClose?.();
  }, [isControlled, onChange, onClose]);

  // Handle clear selection
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isControlled) {
      setSelectedValue(null);
    }

    onChange?.(null);
  }, [isControlled, onChange]);

  // Handle dropdown toggle
  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newIsOpen = !state.isOpen;
    
    setState(prev => ({
      ...prev,
      isOpen: newIsOpen,
      searchTerm: '',
      highlightedIndex: newIsOpen ? 0 : -1
    }));

    if (newIsOpen) {
      onOpen?.();
      // Focus search input if searchable
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    } else {
      onClose?.();
    }
  }, [disabled, state.isOpen, searchable, onOpen, onClose]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prev => ({
      ...prev,
      searchTerm: value,
      highlightedIndex: 0
    }));
    onSearchChange?.(value);
  }, [onSearchChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!state.isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setState(prev => ({ ...prev, isOpen: false, searchTerm: '' }));
        onClose?.();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: Math.min(prev.highlightedIndex + 1, filteredOptions.length - 1)
        }));
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          highlightedIndex: Math.max(prev.highlightedIndex - 1, 0)
        }));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (state.highlightedIndex >= 0 && filteredOptions[state.highlightedIndex]) {
          handleSelect(filteredOptions[state.highlightedIndex]);
        }
        break;
        
      case 'Tab':
        setState(prev => ({ ...prev, isOpen: false, searchTerm: '' }));
        onClose?.();
        break;
    }
  }, [state.isOpen, state.highlightedIndex, filteredOptions, handleToggle, handleSelect, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false, searchTerm: '' }));
        onClose?.();
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.isOpen, onClose]);

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        container: 'h-8 text-sm px-3',
        icon: 'w-4 h-4',
        dropdown: 'text-sm',
        option: 'px-3 py-1.5 text-sm'
      },
      md: {
        container: 'h-10 text-base px-3',
        icon: 'w-5 h-5',
        dropdown: 'text-base',
        option: 'px-3 py-2 text-base'
      },
      lg: {
        container: 'h-12 text-lg px-4',
        icon: 'w-6 h-6',
        dropdown: 'text-lg',
        option: 'px-4 py-3 text-lg'
      }
    };
    return configs[size];
  };

  // Variant configurations
  const getVariantConfig = () => {
    const configs = {
      default: {
        container: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        dropdown: 'border-gray-200'
      },
      error: {
        container: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        dropdown: 'border-red-200'
      },
      success: {
        container: 'border-green-300 focus:border-green-500 focus:ring-green-500',
        dropdown: 'border-green-200'
      },
      warning: {
        container: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
        dropdown: 'border-yellow-200'
      }
    };
    return configs[variant];
  };

  const sizeConfig = getSizeConfig();
  const variantConfig = getVariantConfig();
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = `
    relative w-full border rounded-md bg-white cursor-pointer
    transition-colors duration-150 ease-in-out
    ${sizeConfig.container}
    ${variantConfig.container}
    ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400'}
    ${state.isOpen ? 'ring-1' : ''}
    ${className}
  `;

  const dropdownClasses = `
    absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg
    ${variantConfig.dropdown}
    ${sizeConfig.dropdown}
    ${dropdownClassName}
  `;

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && !error && (
        <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      )}

      {/* Select Container */}
      <div ref={containerRef} className="relative">
        {/* Hidden select for form submission */}
        <select
          id={selectId}
          name={name}
          value={selectedValue || ''}
          required={required}
          disabled={disabled}
          onChange={() => {}} // Handled by custom logic
          className="sr-only"
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Select Display */}
        <div
          className={containerClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={state.isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${selectId}-label` : undefined}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center flex-1 min-w-0">
              {selectedOption?.icon && (
                <div className="mr-2 flex-shrink-0">
                  {selectedOption.icon}
                </div>
              )}
              <span
                className={`block truncate ${
                  selectedOption ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {/* Clear Button */}
              {clearable && selectedValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 rounded"
                  tabIndex={-1}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}

              {/* Loading Indicator */}
              {loading ? (
                <div className="animate-spin">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                </div>
              ) : (
                /* Dropdown Arrow */
                <div className="pointer-events-none">
                  {state.isOpen ? (
                    <ChevronUp className={`${sizeConfig.icon} text-gray-400`} />
                  ) : (
                    <ChevronDown className={`${sizeConfig.icon} text-gray-400`} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown */}
        {state.isOpen && (
          <div className={dropdownClasses} ref={dropdownRef}>
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={state.searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Options */}
            <div
              className="overflow-auto"
              style={{ maxHeight: `${maxHeight}px` }}
              role="listbox"
            >
              {filteredOptions.length === 0 ? (
                <div className={`${sizeConfig.option} text-gray-500 text-center`}>
                  {noOptionsText}
                </div>
              ) : (
                Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                  <div key={groupName}>
                    {/* Group Header */}
                    {groupName !== 'default' && (
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                        {groupName}
                      </div>
                    )}

                    {/* Group Options */}
                    {groupOptions.map((option, index) => {
                      const globalIndex = filteredOptions.indexOf(option);
                      const isHighlighted = globalIndex === state.highlightedIndex;
                      const isSelected = option.value === selectedValue;

                      return (
                        <div
                          key={option.value}
                          className={`
                            ${sizeConfig.option} cursor-pointer flex items-center justify-between
                            ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                            ${isHighlighted ? 'bg-blue-50' : ''}
                            ${isSelected ? 'bg-blue-100 text-blue-900' : ''}
                            ${optionClassName}
                          `}
                          onClick={() => handleSelect(option)}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            {option.icon && (
                              <div className="mr-2 flex-shrink-0">
                                {option.icon}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-gray-500 truncate">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

// Example usage component
export const ExampleDropdownSelects: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>('electronics');
  const [selectedUser, setSelectedUser] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States', icon: '🇺🇸' },
    { value: 'ca', label: 'Canada', icon: '🇨🇦' },
    { value: 'uk', label: 'United Kingdom', icon: '🇬🇧' },
    { value: 'de', label: 'Germany', icon: '🇩🇪' },
    { value: 'fr', label: 'France', icon: '🇫🇷' },
    { value: 'jp', label: 'Japan', icon: '🇯🇵' },
    { value: 'au', label: 'Australia', icon: '🇦🇺' }
  ];

  const categoryOptions: SelectOption[] = [
    { value: 'electronics', label: 'Electronics', group: 'Products' },
    { value: 'clothing', label: 'Clothing', group: 'Products' },
    { value: 'books', label: 'Books', group: 'Products' },
    { value: 'home', label: 'Home & Garden', group: 'Products' },
    { value: 'support', label: 'Customer Support', group: 'Services' },
    { value: 'consulting', label: 'Consulting', group: 'Services' },
    { value: 'training', label: 'Training', group: 'Services' }
  ];

  const userOptions: SelectOption[] = [
    {
      value: 1,
      label: 'John Doe',
      description: 'Software Engineer',
      icon: <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">JD</div>
    },
    {
      value: 2,
      label: 'Jane Smith',
      description: 'Product Manager',
      icon: <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">JS</div>
    },
    {
      value: 3,
      label: 'Bob Johnson',
      description: 'Designer',
      icon: <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">BJ</div>
    },
    {
      value: 4,
      label: 'Alice Brown',
      description: 'Marketing Manager',
      disabled: true,
      icon: <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">AB</div>
    }
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Dropdown Select Examples</h3>

        <div className="space-y-8">
          {/* Basic Select */}
          <div>
            <h4 className="font-medium mb-4">Basic Select</h4>
            <DropdownSelect
              label="Country"
              description="Select your country"
              placeholder="Choose a country..."
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              searchable
              clearable
            />
          </div>

          {/* Grouped Options */}
          <div>
            <h4 className="font-medium mb-4">Grouped Options</h4>
            <DropdownSelect
              label="Category"
              description="Select a category"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              variant="success"
            />
          </div>

          {/* With Icons and Descriptions */}
          <div>
            <h4 className="font-medium mb-4">With Icons and Descriptions</h4>
            <DropdownSelect
              label="Assign User"
              description="Select a user to assign this task"
              placeholder="Choose a user..."
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              variant="primary"
            />
          </div>

          {/* Size Variants */}
          <div>
            <h4 className="font-medium mb-4">Size Variants</h4>
            <div className="space-y-4">
              <DropdownSelect
                label="Small Select"
                options={countryOptions.slice(0, 4)}
                size="sm"
                placeholder="Small size..."
              />
              
              <DropdownSelect
                label="Medium Select"
                options={countryOptions.slice(0, 4)}
                size="md"
                placeholder="Medium size..."
              />
              
              <DropdownSelect
                label="Large Select"
                options={countryOptions.slice(0, 4)}
                size="lg"
                placeholder="Large size..."
              />
            </div>
          </div>

          {/* States */}
          <div>
            <h4 className="font-medium mb-4">Different States</h4>
            <div className="space-y-4">
              <DropdownSelect
                label="Error State"
                options={countryOptions.slice(0, 4)}
                variant="error"
                error="Please select a valid option"
                placeholder="Error state..."
              />
              
              <DropdownSelect
                label="Disabled State"
                options={countryOptions.slice(0, 4)}
                disabled
                placeholder="Disabled select..."
              />
              
              <DropdownSelect
                label="Loading State"
                options={countryOptions.slice(0, 4)}
                loading
                placeholder="Loading..."
              />
            </div>
          </div>

          {/* Non-searchable */}
          <div>
            <h4 className="font-medium mb-4">Non-searchable</h4>
            <DropdownSelect
              label="Simple Select"
              description="No search functionality"
              options={categoryOptions.slice(0, 4)}
              searchable={false}
              placeholder="Choose an option..."
            />
          </div>

          {/* Required Field */}
          <div>
            <h4 className="font-medium mb-4">Required Field</h4>
            <DropdownSelect
              label="Required Selection"
              description="This field is required"
              options={countryOptions.slice(0, 4)}
              required
              clearable={false}
              placeholder="Please select..."
            />
          </div>
        </div>

        {/* Current State Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current Selections</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Country:</strong> {selectedCountry || 'None'}</p>
            <p><strong>Category:</strong> {selectedCategory || 'None'}</p>
            <p><strong>User:</strong> {selectedUser || 'None'}</p>
            <p><strong>Search Term:</strong> {searchTerm || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownSelect;