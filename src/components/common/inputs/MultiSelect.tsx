import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Search, X, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: (string | number)[];
  defaultValue?: (string | number)[];
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
  maxSelected?: number;
  showSelectAll?: boolean;
  showSelectedCount?: boolean;
  loading?: boolean;
  noOptionsText?: string;
  searchPlaceholder?: string;
  onChange?: (values: (string | number)[]) => void;
  onSearchChange?: (search: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  dropdownClassName?: string;
  chipClassName?: string;
  name?: string;
  id?: string;
  chipColor?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'indigo';
  chipVariant?: 'default' | 'solid' | 'outline';
}

export interface MultiSelectState {
  isOpen: boolean;
  searchTerm: string;
  highlightedIndex: number;
  isFocused: boolean;
  selectedValues: (string | number)[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [],
  value: controlledValue,
  defaultValue = [],
  placeholder = 'Select options...',
  disabled = false,
  required = false,
  searchable = true,
  clearable = true,
  size = 'md',
  variant = 'default',
  label,
  description,
  error,
  maxSelected,
  showSelectAll = true,
  showSelectedCount = true,
  loading = false,
  noOptionsText = 'No options found',
  searchPlaceholder = 'Search options...',
  onChange,
  onSearchChange,
  onOpen,
  onClose,
  className = '',
  dropdownClassName = '',
  chipClassName = '',
  name,
  id,
  chipColor = 'default',
  chipVariant = 'default'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;

  const [state, setState] = useState<MultiSelectState>({
    isOpen: false,
    searchTerm: '',
    highlightedIndex: -1,
    isFocused: false,
    selectedValues: controlledValue || defaultValue
  });

  // Update state when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue) {
      setState(prev => ({ ...prev, selectedValues: controlledValue }));
    }
  }, [controlledValue, isControlled]);

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(state.searchTerm.toLowerCase()))
  );

  // Group options
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || 'default';
    if (!groups[group]) groups[group] = [];
    groups[group].push(option);
    return groups;
  }, {} as Record<string, MultiSelectOption[]>);

  const selectedOptions = options.filter(option => 
    state.selectedValues.includes(option.value)
  );

  const handleToggle = useCallback(() => {
    if (disabled) return;
    
    setState(prev => ({ ...prev, isOpen: !prev.isOpen, highlightedIndex: -1 }));
    
    if (!state.isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [disabled, state.isOpen, onOpen, onClose]);

  const handleSelect = useCallback((option: MultiSelectOption) => {
    if (option.disabled) return;

    const isSelected = state.selectedValues.includes(option.value);
    let newValues: (string | number)[];

    if (isSelected) {
      newValues = state.selectedValues.filter(v => v !== option.value);
    } else {
      if (maxSelected && state.selectedValues.length >= maxSelected) {
        return; // Don't add if max selected reached
      }
      newValues = [...state.selectedValues, option.value];
    }

    if (!isControlled) {
      setState(prev => ({ ...prev, selectedValues: newValues }));
    }

    onChange?.(newValues);
  }, [state.selectedValues, isControlled, onChange, maxSelected]);

  const handleSelectAll = useCallback(() => {
    const allValues = filteredOptions
      .filter(option => !option.disabled)
      .map(option => option.value);
    
    const isAllSelected = allValues.every(value => state.selectedValues.includes(value));
    const newValues = isAllSelected ? [] : allValues;

    if (!isControlled) {
      setState(prev => ({ ...prev, selectedValues: newValues }));
    }

    onChange?.(newValues);
  }, [filteredOptions, state.selectedValues, isControlled, onChange]);

  const handleRemoveOption = useCallback((optionValue: string | number) => {
    const newValues = state.selectedValues.filter(v => v !== optionValue);

    if (!isControlled) {
      setState(prev => ({ ...prev, selectedValues: newValues }));
    }

    onChange?.(newValues);
  }, [state.selectedValues, isControlled, onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isControlled) {
      setState(prev => ({ ...prev, selectedValues: [] }));
    }

    onChange?.([]);
  }, [isControlled, onChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setState(prev => ({ 
      ...prev, 
      searchTerm: searchValue,
      highlightedIndex: -1
    }));
    onSearchChange?.(searchValue);
  }, [onSearchChange]);

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
        container: 'min-h-8 text-sm px-3 py-1',
        chip: 'text-xs px-2 py-0.5',
        icon: 'w-4 h-4',
        dropdown: 'text-sm',
        option: 'px-3 py-1.5 text-sm',
        text: 'text-sm'
      },
      md: {
        container: 'min-h-10 text-base px-3 py-2',
        chip: 'text-sm px-2 py-1',
        icon: 'w-5 h-5',
        dropdown: 'text-base',
        option: 'px-3 py-2 text-base',
        text: 'text-base'
      },
      lg: {
        container: 'min-h-12 text-lg px-4 py-3',
        chip: 'text-base px-3 py-1.5',
        icon: 'w-6 h-6',
        dropdown: 'text-lg',
        option: 'px-4 py-3 text-lg',
        text: 'text-lg'
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

  // Get chip styling configuration
  const getChipConfig = () => {
    const baseStyles = chipVariant === 'solid' ? 'border-transparent' : 'border-current bg-transparent';
    const chipConfigs = {
      default: `bg-gray-100 text-gray-800 border-gray-200 ${baseStyles}`,
      blue: `bg-blue-100 text-blue-800 border-blue-200 ${baseStyles}`,
      green: `bg-green-100 text-green-800 border-green-200 ${baseStyles}`,
      yellow: `bg-yellow-100 text-yellow-800 border-yellow-200 ${baseStyles}`,
      red: `bg-red-100 text-red-800 border-red-200 ${baseStyles}`,
      purple: `bg-purple-100 text-purple-800 border-purple-200 ${baseStyles}`,
      pink: `bg-pink-100 text-pink-800 border-pink-200 ${baseStyles}`,
      indigo: `bg-indigo-100 text-indigo-800 border-indigo-200 ${baseStyles}`,
      primary: `bg-blue-100 text-blue-800 border-blue-200 ${baseStyles}`,
      success: `bg-green-100 text-green-800 border-green-200 ${baseStyles}`,
      warning: `bg-yellow-100 text-yellow-800 border-yellow-200 ${baseStyles}`,
      error: `bg-red-100 text-red-800 border-red-200 ${baseStyles}`
    };
    
    return chipConfigs[chipColor as keyof typeof chipConfigs] || chipConfigs.default;
  };

  const sizeConfig = getSizeConfig();
  const variantConfig = getVariantConfig();
  const selectId = id || name || `multi-select-${Math.random().toString(36).substr(2, 9)}`;

  // Get container styling
  const containerClasses = `
    relative w-full border rounded-md transition-colors
    ${sizeConfig.container}
    ${disabled 
      ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
      : error 
        ? 'border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
        : state.isOpen || state.isFocused
          ? 'border-blue-500 ring-1 ring-blue-500'
          : `${variantConfig.container} hover:border-gray-400`
    }
  `;

  const dropdownClasses = `
    absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto
    ${variantConfig.dropdown} border
    ${dropdownClassName}
  `;

  const handleOptionSelect = handleSelect;

  return (
    <div className={`space-y-1 ${className}`}>
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
          required={required && state.selectedValues.length === 0}
          disabled={disabled}
          multiple
          value={state.selectedValues.map(String)}
          onChange={() => {}} // Handled by custom logic
          className="sr-only"
        >
          {state.selectedValues.map(value => (
            <option key={value} value={String(value)} selected>
              {options.find(opt => opt.value === value)?.label}
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
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex-1 min-w-0">
              {selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`
                        inline-flex items-center gap-1 rounded-md
                        ${sizeConfig.chip}
                        ${getChipConfig()}
                        ${chipClassName}
                      `}
                    >
                      {option.icon && (
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                      )}
                      <span className="truncate max-w-24">
                        {option.label}
                      </span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOption(option.value);
                          }}
                          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className={`${sizeConfig.text} text-gray-500 block truncate`}>
                  {placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {/* Clear Button */}
              {clearable && selectedOptions.length > 0 && !disabled && (
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
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Select All Option */}
            {showSelectAll && filteredOptions.length > 0 && (
              <div className="border-b border-gray-200">
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                  onClick={handleSelectAll}
                >
                  <span className="text-sm font-medium">
                    {selectedOptions.length === filteredOptions.length ? 'Deselect All' : 'Select All'}
                  </span>
                  {selectedOptions.length === filteredOptions.length && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {noOptionsText}
                </div>
              ) : (
                Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                  <div key={groupName || 'ungrouped'}>
                    {groupName && groupName !== 'default' && (
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                        {groupName}
                      </div>
                    )}
                    <div>
                      {groupOptions.map((option) => {
                        const isSelected = state.selectedValues.includes(option.value);
                        const isHighlighted = filteredOptions.indexOf(option) === state.highlightedIndex;
                        const isDisabled = option.disabled || (maxSelected && selectedOptions.length >= maxSelected && !isSelected);

                        return (
                          <div
                            key={option.value}
                            className={`
                              px-3 py-2 cursor-pointer flex items-center justify-between
                              ${isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-50'}
                              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            onClick={() => !isDisabled && handleOptionSelect(option)}
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
                              {isSelected && (
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Count */}
      {showSelectedCount && selectedOptions.length > 0 && (
        <p className="text-xs text-gray-600">
          {selectedOptions.length} option{selectedOptions.length !== 1 ? 's' : ''} selected
          {maxSelected && ` (max ${maxSelected})`}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

// Hook for managing multi-select state
export const useMultiSelect = (initialValues: (string | number)[] = []) => {
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(initialValues);

  const toggleValue = useCallback((value: string | number) => {
    setSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  }, []);

  const selectValue = useCallback((value: string | number) => {
    setSelectedValues(prev => 
      prev.includes(value) ? prev : [...prev, value]
    );
  }, []);

  const deselectValue = useCallback((value: string | number) => {
    setSelectedValues(prev => prev.filter(v => v !== value));
  }, []);

  const selectAll = useCallback((values: (string | number)[]) => {
    setSelectedValues(values);
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedValues([]);
  }, []);

  const isSelected = useCallback((value: string | number) => {
    return selectedValues.includes(value);
  }, [selectedValues]);

  const getSelectedCount = useCallback(() => {
    return selectedValues.length;
  }, [selectedValues]);

  return {
    selectedValues,
    setSelectedValues,
    toggleValue,
    selectValue,
    deselectValue,
    selectAll,
    deselectAll,
    isSelected,
    getSelectedCount
  };
};

// Example usage component
export const ExampleMultiSelects: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<(string | number)[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<(string | number)[]>(['react', 'typescript']);
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);

  const countryOptions: MultiSelectOption[] = [
    { value: 'us', label: 'United States', icon: '🇺🇸', group: 'North America' },
    { value: 'ca', label: 'Canada', icon: '🇨🇦', group: 'North America' },
    { value: 'uk', label: 'United Kingdom', icon: '🇬🇧', group: 'Europe' },
    { value: 'de', label: 'Germany', icon: '🇩🇪', group: 'Europe' },
    { value: 'fr', label: 'France', icon: '🇫🇷', group: 'Europe' },
    { value: 'jp', label: 'Japan', icon: '🇯🇵', group: 'Asia' },
    { value: 'au', label: 'Australia', icon: '🇦🇺', group: 'Oceania' }
  ];

  const skillOptions: MultiSelectOption[] = [
    { value: 'react', label: 'React', color: '#61DAFB' },
    { value: 'typescript', label: 'TypeScript', color: '#3178C6' },
    { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
    { value: 'python', label: 'Python', color: '#3776AB' },
    { value: 'nodejs', label: 'Node.js', color: '#339933' },
    { value: 'graphql', label: 'GraphQL', color: '#E10098' },
    { value: 'docker', label: 'Docker', color: '#2496ED' },
    { value: 'aws', label: 'AWS', color: '#232F3E' }
  ];

  const userOptions: MultiSelectOption[] = [
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
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Multi-Select Examples</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Multi-Select */}
          <div>
            <h4 className="font-medium mb-4">Countries (Grouped)</h4>
            <MultiSelect
              label="Select Countries"
              description="Choose multiple countries"
              placeholder="Select countries..."
              options={countryOptions}
              value={selectedCountries}
              onChange={setSelectedCountries}
              variant="default"
              chipColor="default"
              showSelectAll
            />
          </div>

          {/* Skills Multi-Select */}
          <div>
            <h4 className="font-medium mb-4">Skills (Chip Style)</h4>
            <MultiSelect
              label="Technical Skills"
              description="Select your technical skills"
              placeholder="Choose skills..."
              options={skillOptions}
              value={selectedSkills}
              onChange={setSelectedSkills}
              chipVariant="solid"
              chipColor="success"
              maxSelected={5}
              size="md"
            />
          </div>

          {/* Users Multi-Select */}
          <div>
            <h4 className="font-medium mb-4">Team Members</h4>
            <MultiSelect
              label="Assign Team Members"
              description="Select team members for this project"
              options={userOptions}
              value={selectedUsers}
              onChange={setSelectedUsers}
              placeholder="Choose team members..."
              searchable
              showSelectAll
              maxSelected={5}
              size="md"
            />
          </div>
        </div>

        {/* Current Values Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current Selections</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Countries:</strong> {selectedCountries.join(', ') || 'None selected'}
            </div>
            <div>
              <strong>Skills:</strong> {selectedSkills.join(', ') || 'None selected'}
            </div>
            <div>
              <strong>Team Members:</strong> {selectedUsers.join(', ') || 'None selected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;