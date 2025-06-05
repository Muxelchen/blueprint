import React, { useState, useCallback, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  showIcons?: boolean;
  customIcons?: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean, event: React.MouseEvent | React.KeyboardEvent) => void;
  className?: string;
  switchClassName?: string;
  labelClassName?: string;
  name?: string;
  id?: string;
  required?: boolean;
  loading?: boolean;
  animate?: boolean;
}

export interface ToggleSwitchState {
  isChecked: boolean;
  isFocused: boolean;
  isPressed: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  showIcons = false,
  customIcons,
  onChange,
  onToggle,
  className = '',
  switchClassName = '',
  labelClassName = '',
  name,
  id,
  required = false,
  loading = false,
  animate = true
}) => {
  const isControlled = controlledChecked !== undefined;
  
  const [state, setState] = useState<ToggleSwitchState>({
    isChecked: controlledChecked ?? defaultChecked,
    isFocused: false,
    isPressed: false
  });

  // Update state when controlled value changes
  useEffect(() => {
    if (isControlled && controlledChecked !== state.isChecked) {
      setState(prev => ({ ...prev, isChecked: controlledChecked }));
    }
  }, [controlledChecked, isControlled]);

  const handleToggle = useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
    if (disabled || loading) return;

    const newChecked = !state.isChecked;
    
    if (!isControlled) {
      setState(prev => ({ ...prev, isChecked: newChecked }));
    }

    onChange?.(newChecked);
    onToggle?.(newChecked, event);
  }, [disabled, loading, state.isChecked, isControlled, onChange, onToggle]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    handleToggle(event);
  }, [handleToggle]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setState(prev => ({ ...prev, isPressed: true }));
      handleToggle(event);
    }
  }, [handleToggle]);

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setState(prev => ({ ...prev, isPressed: false }));
    }
  }, []);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false, isPressed: false }));
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setState(prev => ({ ...prev, isPressed: true }));
    }
  }, [disabled, loading]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        container: 'w-9 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-4',
        padding: 'p-0.5',
        iconSize: 'w-2.5 h-2.5',
        labelText: 'text-sm'
      },
      md: {
        container: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
        padding: 'p-0.5',
        iconSize: 'w-3 h-3',
        labelText: 'text-base'
      },
      lg: {
        container: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
        padding: 'p-0.5',
        iconSize: 'w-4 h-4',
        labelText: 'text-lg'
      }
    };
    return configs[size];
  };

  // Variant configurations
  const getVariantConfig = () => {
    const configs = {
      default: {
        checkedBg: 'bg-blue-600',
        uncheckedBg: 'bg-gray-200',
        checkedHover: 'hover:bg-blue-700',
        uncheckedHover: 'hover:bg-gray-300',
        focusRing: 'focus:ring-blue-500'
      },
      success: {
        checkedBg: 'bg-green-600',
        uncheckedBg: 'bg-gray-200',
        checkedHover: 'hover:bg-green-700',
        uncheckedHover: 'hover:bg-gray-300',
        focusRing: 'focus:ring-green-500'
      },
      warning: {
        checkedBg: 'bg-yellow-500',
        uncheckedBg: 'bg-gray-200',
        checkedHover: 'hover:bg-yellow-600',
        uncheckedHover: 'hover:bg-gray-300',
        focusRing: 'focus:ring-yellow-500'
      },
      danger: {
        checkedBg: 'bg-red-600',
        uncheckedBg: 'bg-gray-200',
        checkedHover: 'hover:bg-red-700',
        uncheckedHover: 'hover:bg-gray-300',
        focusRing: 'focus:ring-red-500'
      }
    };
    return configs[variant];
  };

  const sizeConfig = getSizeConfig();
  const variantConfig = getVariantConfig();
  const switchId = id || name || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  // Style classes
  const containerClasses = `
    relative inline-flex items-center rounded-full transition-all duration-200 ease-in-out cursor-pointer
    ${sizeConfig.container} ${sizeConfig.padding}
    ${state.isChecked ? variantConfig.checkedBg : variantConfig.uncheckedBg}
    ${!disabled && !loading ? (state.isChecked ? variantConfig.checkedHover : variantConfig.uncheckedHover) : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${state.isFocused ? `ring-2 ring-offset-2 ${variantConfig.focusRing}` : ''}
    ${state.isPressed && animate ? 'scale-95' : ''}
    ${switchClassName}
  `;

  const thumbClasses = `
    inline-block rounded-full bg-white shadow-lg transform transition-all duration-200 ease-in-out
    ${sizeConfig.thumb}
    ${state.isChecked ? sizeConfig.translate : 'translate-x-0'}
    ${state.isPressed && animate ? 'scale-110' : ''}
    ${loading ? 'animate-pulse' : ''}
  `;

  const getIcon = () => {
    if (!showIcons && !customIcons) return null;

    if (customIcons) {
      return state.isChecked ? customIcons.checked : customIcons.unchecked;
    }

    return state.isChecked ? (
      <Check className={`${sizeConfig.iconSize} text-white`} />
    ) : (
      <X className={`${sizeConfig.iconSize} text-gray-400`} />
    );
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      {/* Hidden input for form submission */}
      <input
        type="checkbox"
        id={switchId}
        name={name}
        checked={state.isChecked}
        required={required}
        disabled={disabled}
        onChange={() => {}} // Handled by container click
        className="sr-only"
      />

      {/* Toggle Switch */}
      <div
        role="switch"
        aria-checked={state.isChecked}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        aria-describedby={description ? `${switchId}-description` : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={containerClasses}
      >
        {/* Background Icon */}
        {(showIcons || customIcons) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {getIcon()}
          </div>
        )}

        {/* Thumb */}
        <div className={thumbClasses}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 border border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              id={`${switchId}-label`}
              htmlFor={switchId}
              className={`block font-medium cursor-pointer ${
                disabled ? 'text-gray-400' : 'text-gray-900'
              } ${sizeConfig.labelText} ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p
              id={`${switchId}-description`}
              className={`mt-1 text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Toggle Group Component
export interface ToggleGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  children,
  orientation = 'vertical',
  className = '',
  spacing = 'md'
}) => {
  const getSpacingClass = () => {
    const spacings = {
      sm: orientation === 'horizontal' ? 'space-x-4' : 'space-y-2',
      md: orientation === 'horizontal' ? 'space-x-6' : 'space-y-4',
      lg: orientation === 'horizontal' ? 'space-x-8' : 'space-y-6'
    };
    return spacings[spacing];
  };

  const orientationClass = orientation === 'horizontal' ? 'flex flex-wrap items-center' : 'space-y-0';

  return (
    <div className={`${orientationClass} ${getSpacingClass()} ${className}`}>
      {children}
    </div>
  );
};

// Hook for managing multiple toggles
export const useToggleGroup = (initialState: Record<string, boolean> = {}) => {
  const [toggles, setToggles] = useState(initialState);

  const updateToggle = useCallback((key: string, value: boolean) => {
    setToggles(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleValue = useCallback((key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetToggles = useCallback((newState: Record<string, boolean> = {}) => {
    setToggles(newState);
  }, []);

  const getToggleValue = useCallback((key: string) => {
    return toggles[key] ?? false;
  }, [toggles]);

  return {
    toggles,
    updateToggle,
    toggleValue,
    resetToggles,
    getToggleValue
  };
};

// Example usage component
export const ExampleToggleSwitches: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [loading, setLoading] = useState(false);

  const { toggles, updateToggle } = useToggleGroup({
    feature1: true,
    feature2: false,
    feature3: true,
    feature4: false
  });

  const handleAsyncToggle = async (checked: boolean) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setAnalytics(checked);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Toggle Switch Examples</h3>
        
        {/* Basic Toggles */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Basic Toggles</h4>
            <ToggleGroup spacing="md">
              <ToggleSwitch
                checked={notifications}
                onChange={setNotifications}
                label="Email Notifications"
                description="Receive email notifications for important updates"
                size="md"
                variant="default"
              />
              
              <ToggleSwitch
                checked={marketing}
                onChange={setMarketing}
                label="Marketing Communications"
                description="Receive promotional emails and newsletters"
                size="md"
                variant="success"
                showIcons
              />
              
              <ToggleSwitch
                checked={analytics}
                onChange={handleAsyncToggle}
                label="Analytics Tracking"
                description="Allow us to collect analytics data to improve your experience"
                size="md"
                variant="warning"
                loading={loading}
                disabled={loading}
              />
            </ToggleGroup>
          </div>

          {/* Size Variants */}
          <div>
            <h4 className="font-medium mb-4">Size Variants</h4>
            <ToggleGroup orientation="horizontal" spacing="lg">
              <ToggleSwitch
                defaultChecked={true}
                label="Small"
                size="sm"
                variant="default"
              />
              
              <ToggleSwitch
                defaultChecked={true}
                label="Medium"
                size="md"
                variant="default"
              />
              
              <ToggleSwitch
                defaultChecked={true}
                label="Large"
                size="lg"
                variant="default"
              />
            </ToggleGroup>
          </div>

          {/* Color Variants */}
          <div>
            <h4 className="font-medium mb-4">Color Variants</h4>
            <ToggleGroup orientation="horizontal" spacing="lg">
              <ToggleSwitch
                defaultChecked={true}
                label="Default"
                variant="default"
                showIcons
              />
              
              <ToggleSwitch
                defaultChecked={true}
                label="Success"
                variant="success"
                showIcons
              />
              
              <ToggleSwitch
                defaultChecked={true}
                label="Warning"
                variant="warning"
                showIcons
              />
              
              <ToggleSwitch
                defaultChecked={true}
                label="Danger"
                variant="danger"
                showIcons
              />
            </ToggleGroup>
          </div>

          {/* Custom Icons */}
          <div>
            <h4 className="font-medium mb-4">Custom Icons</h4>
            <ToggleGroup spacing="md">
              <ToggleSwitch
                defaultChecked={false}
                label="Dark Mode"
                description="Switch to dark theme"
                customIcons={{
                  checked: <span className="text-yellow-400">🌙</span>,
                  unchecked: <span className="text-yellow-400">☀️</span>
                }}
                variant="default"
              />
              
              <ToggleSwitch
                defaultChecked={true}
                label="Sound Effects"
                description="Enable audio feedback"
                customIcons={{
                  checked: <span className="text-blue-400">🔊</span>,
                  unchecked: <span className="text-gray-400">🔇</span>
                }}
                variant="default"
              />
            </ToggleGroup>
          </div>

          {/* Managed Toggle Group */}
          <div>
            <h4 className="font-medium mb-4">Feature Toggles</h4>
            <ToggleGroup spacing="md">
              <ToggleSwitch
                checked={toggles.feature1}
                onChange={(checked) => updateToggle('feature1', checked)}
                label="Advanced Search"
                description="Enable enhanced search capabilities"
                variant="success"
              />
              
              <ToggleSwitch
                checked={toggles.feature2}
                onChange={(checked) => updateToggle('feature2', checked)}
                label="Beta Features"
                description="Access experimental features (may be unstable)"
                variant="warning"
              />
              
              <ToggleSwitch
                checked={toggles.feature3}
                onChange={(checked) => updateToggle('feature3', checked)}
                label="Auto-Save"
                description="Automatically save your work"
                variant="success"
              />
              
              <ToggleSwitch
                checked={toggles.feature4}
                onChange={(checked) => updateToggle('feature4', checked)}
                label="Collaborative Mode"
                description="Enable real-time collaboration"
                variant="default"
              />
            </ToggleGroup>
          </div>

          {/* Disabled States */}
          <div>
            <h4 className="font-medium mb-4">Disabled States</h4>
            <ToggleGroup spacing="md">
              <ToggleSwitch
                checked={true}
                label="Enabled & Checked"
                description="This toggle is enabled and checked"
                disabled={true}
              />
              
              <ToggleSwitch
                checked={false}
                label="Enabled & Unchecked"
                description="This toggle is enabled but unchecked"
                disabled={true}
              />
            </ToggleGroup>
          </div>
        </div>

        {/* Current State Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current State</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Notifications:</strong> {notifications ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Marketing:</strong> {marketing ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Analytics:</strong> {analytics ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <p><strong>Feature Toggles:</strong></p>
              <pre className="text-xs bg-white p-2 rounded border mt-1">
                {JSON.stringify(toggles, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;