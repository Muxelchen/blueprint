import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (checked: boolean, indeterminate?: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  animate?: boolean;
}

export interface CheckboxState {
  isChecked: boolean;
  isIndeterminate: boolean;
  isFocused: boolean;
  isPressed: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  required = false,
  invalid = false,
  name,
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  checkboxClassName = '',
  labelClassName = '',
  animate = true
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledChecked !== undefined;
  
  const [state, setState] = useState<CheckboxState>({
    isChecked: controlledChecked ?? defaultChecked,
    isIndeterminate: indeterminate,
    isFocused: false,
    isPressed: false
  });

  // Update state when controlled values change
  useEffect(() => {
    if (isControlled && controlledChecked !== state.isChecked) {
      setState(prev => ({ ...prev, isChecked: controlledChecked, isIndeterminate: false }));
    }
  }, [controlledChecked, isControlled]);

  useEffect(() => {
    setState(prev => ({ ...prev, isIndeterminate: indeterminate }));
  }, [indeterminate]);

  // Set indeterminate property on DOM element
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = state.isIndeterminate;
    }
  }, [state.isIndeterminate]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newChecked = event.target.checked;
    const newIndeterminate = false; // Clicking always resolves indeterminate state
    
    if (!isControlled) {
      setState(prev => ({ 
        ...prev, 
        isChecked: newChecked, 
        isIndeterminate: newIndeterminate 
      }));
    }

    onChange?.(newChecked, newIndeterminate);
  }, [disabled, isControlled, onChange]);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false, isPressed: false }));
    onBlur?.();
  }, [onBlur]);

  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setState(prev => ({ ...prev, isPressed: true }));
    }
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        checkbox: 'w-4 h-4',
        icon: 'w-3 h-3',
        label: 'text-sm',
        description: 'text-xs'
      },
      md: {
        checkbox: 'w-5 h-5',
        icon: 'w-3.5 h-3.5',
        label: 'text-base',
        description: 'text-sm'
      },
      lg: {
        checkbox: 'w-6 h-6',
        icon: 'w-4 h-4',
        label: 'text-lg',
        description: 'text-base'
      }
    };
    return configs[size];
  };

  // Variant configurations
  const getVariantConfig = () => {
    const configs = {
      default: {
        border: 'border-gray-300',
        checked: 'bg-gray-600 border-gray-600',
        focus: 'focus:ring-gray-500',
        hover: 'hover:border-gray-400'
      },
      primary: {
        border: 'border-gray-300',
        checked: 'bg-blue-600 border-blue-600',
        focus: 'focus:ring-blue-500',
        hover: 'hover:border-blue-400'
      },
      success: {
        border: 'border-gray-300',
        checked: 'bg-green-600 border-green-600',
        focus: 'focus:ring-green-500',
        hover: 'hover:border-green-400'
      },
      warning: {
        border: 'border-gray-300',
        checked: 'bg-yellow-500 border-yellow-500',
        focus: 'focus:ring-yellow-500',
        hover: 'hover:border-yellow-400'
      },
      danger: {
        border: 'border-gray-300',
        checked: 'bg-red-600 border-red-600',
        focus: 'focus:ring-red-500',
        hover: 'hover:border-red-400'
      }
    };
    return configs[variant];
  };

  const sizeConfig = getSizeConfig();
  const variantConfig = getVariantConfig();
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Style classes
  const getCheckboxClasses = () => {
    const baseClasses = `
      relative inline-flex items-center justify-center rounded border-2 transition-all duration-200 ease-in-out
      ${sizeConfig.checkbox}
    `;

    const stateClasses = (() => {
      if (disabled) {
        return 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50';
      }

      if (invalid) {
        return 'border-red-500 focus:ring-red-500';
      }

      if (state.isChecked || state.isIndeterminate) {
        return `${variantConfig.checked} text-white`;
      }

      return `
        bg-white ${variantConfig.border} ${variantConfig.hover}
        ${state.isFocused ? `ring-2 ring-offset-2 ${variantConfig.focus}` : ''}
      `;
    })();

    const animationClasses = animate && state.isPressed ? 'scale-90' : '';

    return `${baseClasses} ${stateClasses} ${animationClasses} ${checkboxClassName}`;
  };

  const getIcon = () => {
    if (state.isIndeterminate) {
      return <Minus className={`${sizeConfig.icon} text-white`} />;
    }
    
    if (state.isChecked) {
      return <Check className={`${sizeConfig.icon} text-white`} />;
    }
    
    return null;
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      {/* Checkbox Container */}
      <div className="relative flex-shrink-0">
        <input
          ref={checkboxRef}
          type="checkbox"
          id={checkboxId}
          name={name}
          value={value}
          checked={state.isChecked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="sr-only"
        />
        
        <label
          htmlFor={checkboxId}
          className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <div className={getCheckboxClasses()}>
            {getIcon()}
          </div>
        </label>
      </div>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={checkboxId}
              className={`
                block font-medium cursor-pointer
                ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}
                ${invalid ? 'text-red-600' : ''}
                ${sizeConfig.label}
                ${labelClassName}
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className={`
              mt-1 
              ${disabled ? 'text-gray-400' : 'text-gray-600'}
              ${invalid ? 'text-red-500' : ''}
              ${sizeConfig.description}
            `}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Checkbox Group Component
export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (selectedValues: string[]) => void;
  name?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: CheckboxProps['size'];
  variant?: CheckboxProps['variant'];
  orientation?: 'horizontal' | 'vertical';
  columns?: number;
  className?: string;
  optionClassName?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  name,
  label,
  description,
  required = false,
  disabled = false,
  invalid = false,
  size = 'md',
  variant = 'default',
  orientation = 'vertical',
  columns,
  className = '',
  optionClassName = ''
}) => {
  const isControlled = controlledValue !== undefined;
  const [selectedValues, setSelectedValues] = useState<string[]>(controlledValue || defaultValue);

  useEffect(() => {
    if (isControlled && controlledValue) {
      setSelectedValues(controlledValue);
    }
  }, [controlledValue, isControlled]);

  const handleOptionChange = useCallback((optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(v => v !== optionValue);
    
    if (!isControlled) {
      setSelectedValues(newValues);
    }
    
    onChange?.(newValues);
  }, [selectedValues, isControlled, onChange]);

  const getContainerClasses = () => {
    if (columns && orientation === 'vertical') {
      return `grid grid-cols-${columns} gap-4`;
    }
    
    if (orientation === 'horizontal') {
      return 'flex flex-wrap gap-6';
    }
    
    return 'space-y-4';
  };

  const groupId = name || `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      {/* Group Label */}
      {label && (
        <div className="mb-4">
          <legend className={`text-base font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
          {description && (
            <p className={`mt-1 text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Options */}
      <div className={getContainerClasses()} role="group" aria-labelledby={label ? `${groupId}-label` : undefined}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={(checked) => handleOptionChange(option.value, checked)}
            label={option.label}
            description={option.description}
            disabled={disabled || option.disabled}
            size={size}
            variant={variant}
            invalid={invalid}
            className={optionClassName}
          />
        ))}
      </div>
    </div>
  );
};

// Hook for managing checkbox groups
export const useCheckboxGroup = (initialValues: string[] = []) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues);

  const toggleValue = useCallback((value: string) => {
    setSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  }, []);

  const selectValue = useCallback((value: string) => {
    setSelectedValues(prev => 
      prev.includes(value) ? prev : [...prev, value]
    );
  }, []);

  const deselectValue = useCallback((value: string) => {
    setSelectedValues(prev => prev.filter(v => v !== value));
  }, []);

  const selectAll = useCallback((values: string[]) => {
    setSelectedValues(values);
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedValues([]);
  }, []);

  const isSelected = useCallback((value: string) => {
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
export const ExampleCheckboxes: React.FC = () => {
  const [singleChecked, setSingleChecked] = useState(false);
  const [indeterminateState, setIndeterminateState] = useState({
    parent: false,
    child1: false,
    child2: false,
    child3: false
  });

  const { selectedValues: interests } = useCheckboxGroup(['reading', 'music']);
  const [permissions, setPermissions] = useState<string[]>(['read']);
  const [features, setFeatures] = useState<string[]>([]);

  // Handle parent checkbox for indeterminate example
  const handleParentChange = useCallback((checked: boolean) => {
    setIndeterminateState({
      parent: checked,
      child1: checked,
      child2: checked,
      child3: checked
    });
  }, []);

  const handleChildChange = useCallback((childKey: string, checked: boolean) => {
    setIndeterminateState(prev => {
      const newState = { ...prev, [childKey]: checked };
      const childStates = [newState.child1, newState.child2, newState.child3];
      const checkedCount = childStates.filter(Boolean).length;
      
      return {
        ...newState,
        parent: checkedCount === 3
      };
    });
  }, []);

  const getParentIndeterminate = () => {
    const childStates = [indeterminateState.child1, indeterminateState.child2, indeterminateState.child3];
    const checkedCount = childStates.filter(Boolean).length;
    return checkedCount > 0 && checkedCount < 3;
  };

  const interestOptions: CheckboxOption[] = [
    { value: 'reading', label: 'Reading', description: 'Books, articles, and blogs' },
    { value: 'music', label: 'Music', description: 'Listening and playing instruments' },
    { value: 'sports', label: 'Sports', description: 'Playing and watching sports' },
    { value: 'travel', label: 'Travel', description: 'Exploring new places' },
    { value: 'cooking', label: 'Cooking', description: 'Preparing delicious meals' },
    { value: 'technology', label: 'Technology', description: 'Latest gadgets and software' }
  ];

  const permissionOptions: CheckboxOption[] = [
    { value: 'read', label: 'Read', description: 'View content and data' },
    { value: 'write', label: 'Write', description: 'Create and edit content' },
    { value: 'delete', label: 'Delete', description: 'Remove content and data' },
    { value: 'admin', label: 'Admin', description: 'Full administrative access' }
  ];

  const featureOptions: CheckboxOption[] = [
    { value: 'notifications', label: 'Push Notifications' },
    { value: 'analytics', label: 'Analytics Tracking' },
    { value: 'themes', label: 'Custom Themes' },
    { value: 'export', label: 'Data Export' },
    { value: 'api', label: 'API Access' },
    { value: 'support', label: 'Priority Support' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Checkbox Examples</h3>
        
        <div className="space-y-8">
          {/* Single Checkboxes */}
          <div>
            <h4 className="font-medium mb-4">Single Checkboxes</h4>
            <div className="space-y-4">
              <Checkbox
                checked={singleChecked}
                onChange={setSingleChecked}
                label="Accept Terms and Conditions"
                description="I agree to the terms of service and privacy policy"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Checkbox defaultChecked label="Small" size="sm" variant="primary" />
                <Checkbox defaultChecked label="Medium" size="md" variant="success" />
                <Checkbox defaultChecked label="Large" size="lg" variant="danger" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Checkbox label="Default" variant="default" />
                <Checkbox label="Primary" variant="primary" />
                <Checkbox label="Success" variant="success" />
                <Checkbox label="Warning" variant="warning" />
                <Checkbox label="Danger" variant="danger" />
                <Checkbox label="Disabled" disabled />
              </div>
            </div>
          </div>

          {/* Indeterminate State */}
          <div>
            <h4 className="font-medium mb-4">Indeterminate State</h4>
            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              <Checkbox
                checked={indeterminateState.parent}
                indeterminate={getParentIndeterminate()}
                onChange={handleParentChange}
                label="Select All Features"
                description="Enable or disable all child features"
                variant="primary"
              />
              <div className="ml-6 space-y-2">
                <Checkbox
                  checked={indeterminateState.child1}
                  onChange={(checked) => handleChildChange('child1', checked)}
                  label="Feature A"
                  size="sm"
                />
                <Checkbox
                  checked={indeterminateState.child2}
                  onChange={(checked) => handleChildChange('child2', checked)}
                  label="Feature B"
                  size="sm"
                />
                <Checkbox
                  checked={indeterminateState.child3}
                  onChange={(checked) => handleChildChange('child3', checked)}
                  label="Feature C"
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Checkbox Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4">Interests (Vertical)</h4>
              <CheckboxGroup
                options={interestOptions}
                value={interests}
                onChange={(values) => interests.length = 0 && interests.push(...values)}
                label="Select your interests"
                description="Choose topics that interest you"
                name="interests"
                variant="primary"
              />
            </div>

            <div>
              <h4 className="font-medium mb-4">Permissions</h4>
              <CheckboxGroup
                options={permissionOptions}
                value={permissions}
                onChange={setPermissions}
                label="User Permissions"
                description="Select the permissions for this user"
                name="permissions"
                variant="success"
                required
              />
            </div>
          </div>

          {/* Horizontal Layout */}
          <div>
            <h4 className="font-medium mb-4">Features (Horizontal)</h4>
            <CheckboxGroup
              options={featureOptions}
              value={features}
              onChange={setFeatures}
              label="Optional Features"
              description="Enable additional features for your account"
              name="features"
              orientation="horizontal"
              variant="default"
            />
          </div>

          {/* Grid Layout */}
          <div>
            <h4 className="font-medium mb-4">Grid Layout</h4>
            <CheckboxGroup
              options={interestOptions}
              value={interests}
              onChange={(values) => interests.splice(0, interests.length, ...values)}
              label="Select Interests (Grid)"
              name="interests-grid"
              columns={3}
              variant="primary"
            />
          </div>
        </div>

        {/* Current State Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current State</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Single Checkbox:</strong> {singleChecked ? 'Checked' : 'Unchecked'}</p>
              <p><strong>Selected Interests:</strong> {interests.join(', ') || 'None'}</p>
              <p><strong>Permissions:</strong> {permissions.join(', ') || 'None'}</p>
              <p><strong>Features:</strong> {features.join(', ') || 'None'}</p>
            </div>
            <div>
              <p><strong>Indeterminate State:</strong></p>
              <pre className="text-xs bg-white p-2 rounded border mt-1">
                {JSON.stringify(indeterminateState, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkbox;