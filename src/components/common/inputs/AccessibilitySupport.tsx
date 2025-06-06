import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { Type } from 'lucide-react';

export interface AccessibilityProps {
  enabled?: boolean;
  announceChanges?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  screenReaderMode?: boolean;
  keyboardNavigation?: boolean;
  focusVisible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface AriaLiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all' | 'additions text' | 'additions removals' | 'removals text' | 'text additions' | 'text removals' | 'removals additions';
  busy?: boolean;
}

interface AccessibilityContextType {
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
  setAriaLabel: (element: HTMLElement, label: string) => void;
  setAriaDescription: (element: HTMLElement, description: string) => void;
  setAriaExpanded: (element: HTMLElement, expanded: boolean) => void;
  setAriaSelected: (element: HTMLElement, selected: boolean) => void;
  setAriaPressed: (element: HTMLElement, pressed: boolean) => void;
  setAriaChecked: (element: HTMLElement, checked: boolean | 'mixed') => void;
  setAriaDisabled: (element: HTMLElement, disabled: boolean) => void;
  setAriaHidden: (element: HTMLElement, hidden: boolean) => void;
  addAriaDescribedBy: (element: HTMLElement, describedById: string) => void;
  removeAriaDescribedBy: (element: HTMLElement, describedById: string) => void;
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
}

interface AccessibilityPreferences {
  announceChanges: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  fontSize: number;
  soundEnabled: boolean;
  autoplay: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// ARIA Live Region Component
const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({
  message,
  priority = 'polite',
  atomic = false,
  relevant = 'additions text',
  busy = false
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
      aria-busy={busy}
      className="sr-only"
    >
      {message}
    </div>
  );
};

const AccessibilitySupport: React.FC<AccessibilityProps> = ({
  enabled = true,
  announceChanges = true,
  highContrast = false,
  reducedMotion = false,
  screenReaderMode = false,
  keyboardNavigation = true,
  focusVisible = true,
  className = '',
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [liveMessage, setLiveMessage] = useState('');
  const [livePriority, setLivePriority] = useState<'polite' | 'assertive'>('polite');
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    const saved = localStorage.getItem('accessibility-preferences');
    return saved ? JSON.parse(saved) : {
      announceChanges,
      highContrast,
      reducedMotion,
      screenReaderMode,
      keyboardNavigation,
      focusVisible,
      fontSize: 16,
      soundEnabled: true,
      autoplay: false
    };
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Apply CSS custom properties based on preferences
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Focus visible
    if (preferences.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    // Font size
    root.style.setProperty('--accessibility-font-size', `${preferences.fontSize}px`);
    
    // Screen reader mode
    if (preferences.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }, [preferences]);

  // Announce message function
  const announceMessage = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!preferences.announceChanges) return;
    
    setLiveMessage('');
    setTimeout(() => {
      setLiveMessage(message);
      setLivePriority(priority);
    }, 100);
  }, [preferences.announceChanges]);

  // ARIA helper functions
  const setAriaLabel = useCallback((element: HTMLElement, label: string) => {
    element.setAttribute('aria-label', label);
  }, []);

  const setAriaDescription = useCallback((element: HTMLElement, description: string) => {
    const descId = `desc-${Math.random().toString(36).substring(2, 11)}`;
    const descElement = document.createElement('div');
    descElement.id = descId;
    descElement.className = 'sr-only';
    descElement.textContent = description;
    document.body.appendChild(descElement);
    element.setAttribute('aria-describedby', descId);
  }, []);

  const setAriaExpanded = useCallback((element: HTMLElement, expanded: boolean) => {
    element.setAttribute('aria-expanded', expanded.toString());
  }, []);

  const setAriaSelected = useCallback((element: HTMLElement, selected: boolean) => {
    element.setAttribute('aria-selected', selected.toString());
  }, []);

  const setAriaPressed = useCallback((element: HTMLElement, pressed: boolean) => {
    element.setAttribute('aria-pressed', pressed.toString());
  }, []);

  const setAriaChecked = useCallback((element: HTMLElement, checked: boolean | 'mixed') => {
    element.setAttribute('aria-checked', checked.toString());
  }, []);

  const setAriaDisabled = useCallback((element: HTMLElement, disabled: boolean) => {
    element.setAttribute('aria-disabled', disabled.toString());
    if (disabled) {
      element.setAttribute('tabindex', '-1');
    } else {
      element.removeAttribute('tabindex');
    }
  }, []);

  const setAriaHidden = useCallback((element: HTMLElement, hidden: boolean) => {
    if (hidden) {
      element.setAttribute('aria-hidden', 'true');
    } else {
      element.removeAttribute('aria-hidden');
    }
  }, []);

  const addAriaDescribedBy = useCallback((element: HTMLElement, describedById: string) => {
    const current = element.getAttribute('aria-describedby') || '';
    const ids = current.split(' ').filter(Boolean);
    if (!ids.includes(describedById)) {
      ids.push(describedById);
      element.setAttribute('aria-describedby', ids.join(' '));
    }
  }, []);

  const removeAriaDescribedBy = useCallback((element: HTMLElement, describedById: string) => {
    const current = element.getAttribute('aria-describedby') || '';
    const ids = current.split(' ').filter(id => id !== describedById);
    if (ids.length > 0) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }, []);

  const updatePreferences = useCallback((updates: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
    
    // Announce preference changes
    Object.entries(updates).forEach(([key, value]) => {
      const prefName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      announceMessage(`${prefName} ${value ? 'enabled' : 'disabled'}`);
    });
  }, [announceMessage]);

  const contextValue: AccessibilityContextType = {
    announceMessage,
    setAriaLabel,
    setAriaDescription,
    setAriaExpanded,
    setAriaSelected,
    setAriaPressed,
    setAriaChecked,
    setAriaDisabled,
    setAriaHidden,
    addAriaDescribedBy,
    removeAriaDescribedBy,
    preferences,
    updatePreferences
  };

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={`accessibility-container ${className}`}
        role="main"
      >
        {/* Live region for announcements */}
        <AriaLiveRegion message={liveMessage} priority={livePriority} />
        
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

// Accessible Button Component
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  selected?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  role?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}> = ({
  children,
  onClick,
  disabled = false,
  pressed,
  expanded,
  selected,
  ariaLabel,
  ariaDescription,
  role = 'button',
  className = '',
  variant = 'primary'
}) => {
  const { announceMessage, setAriaDescription: setDesc } = useAccessibility();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current && ariaDescription) {
      setDesc(buttonRef.current, ariaDescription);
    }
  }, [ariaDescription, setDesc]);

  const handleClick = () => {
    if (disabled) return;
    
    onClick?.();
    
    if (ariaLabel) {
      announceMessage(`${ariaLabel} activated`);
    }
  };

  const getVariantClasses = () => {
    const base = 'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      primary: `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300`,
      secondary: `${base} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300`,
      danger: `${base} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300`
    };
    return variants[variant];
  };

  return (
    <button
      ref={buttonRef}
      role={role}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      className={`${getVariantClasses()} ${className}`}
    >
      {children}
    </button>
  );
};

// Accessible Input Component
export const AccessibleInput: React.FC<{
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}> = ({
  label,
  value = '',
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  help,
  placeholder,
  ariaLabel,
  className = ''
}) => {
  const { announceMessage } = useAccessibility();
  const inputId = `input-${Math.random().toString(36).substring(2, 11)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = help ? `${inputId}-help` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    
    if (error) {
      announceMessage(`Input error: ${error}`, 'assertive');
    }
  };

  const describedBy = [helpId, errorId].filter(Boolean).join(' ');

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel || label}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      
      {help && (
        <p id={helpId} className="text-sm text-gray-600">
          {help}
        </p>
      )}
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessibility Preferences Panel
export const AccessibilityPreferencesPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences, announceMessage } = useAccessibility();

  if (!isOpen) return null;

  const togglePreference = (key: keyof AccessibilityPreferences) => {
    const currentValue = preferences[key];
    if (typeof currentValue === 'boolean') {
      updatePreferences({ [key]: !currentValue });
    }
  };

  const updateFontSize = (size: number) => {
    updatePreferences({ fontSize: size });
    announceMessage(`Font size set to ${size} pixels`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-auto"
        role="dialog"
        aria-labelledby="accessibility-title"
        aria-describedby="accessibility-description"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="accessibility-title" className="text-lg font-semibold text-gray-900">
              Accessibility Preferences
            </h2>
            <AccessibleButton
              onClick={onClose}
              variant="secondary"
              ariaLabel="Close preferences"
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              ×
            </AccessibleButton>
          </div>
          
          <p id="accessibility-description" className="text-sm text-gray-600 mb-6">
            Customize your accessibility settings for a better experience.
          </p>
          
          <div className="space-y-4">
            {/* Visual Preferences */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Visual</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.highContrast}
                    onChange={() => togglePreference('highContrast')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">High Contrast</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.reducedMotion}
                    onChange={() => togglePreference('reducedMotion')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Reduce Motion</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.focusVisible}
                    onChange={() => togglePreference('focusVisible')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Enhanced Focus Indicators</span>
                </label>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Font Size</h3>
              <div className="flex items-center space-x-2">
                <AccessibleButton
                  onClick={() => updateFontSize(Math.max(12, preferences.fontSize - 2))}
                  variant="secondary"
                  ariaLabel="Decrease font size"
                  className="px-2 py-1 text-sm"
                >
                  A-
                </AccessibleButton>
                <span className="text-sm px-2">{preferences.fontSize}px</span>
                <AccessibleButton
                  onClick={() => updateFontSize(Math.min(24, preferences.fontSize + 2))}
                  variant="secondary"
                  ariaLabel="Increase font size"
                  className="px-2 py-1 text-sm"
                >
                  A+
                </AccessibleButton>
              </div>
            </div>

            {/* Navigation Preferences */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Navigation</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.keyboardNavigation}
                    onChange={() => togglePreference('keyboardNavigation')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Keyboard Navigation</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.announceChanges}
                    onChange={() => togglePreference('announceChanges')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Announce Changes</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.screenReaderMode}
                    onChange={() => togglePreference('screenReaderMode')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Screen Reader Mode</span>
                </label>
              </div>
            </div>

            {/* Media Preferences */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Media</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={() => togglePreference('soundEnabled')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Sound Effects</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!preferences.autoplay}
                    onChange={() => togglePreference('autoplay')}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Disable Autoplay</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <AccessibleButton
              onClick={onClose}
              variant="primary"
              className="w-full"
              ariaLabel="Save preferences and close"
            >
              Save Preferences
            </AccessibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage component
export const ExampleAccessibilitySupport: React.FC = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);

  const { announceMessage, preferences } = useAccessibility();

  const validateInput = (value: string) => {
    if (value.length < 3) {
      setInputError('Input must be at least 3 characters long');
    } else {
      setInputError('');
      announceMessage('Input is valid');
    }
  };

  const togglePressed = () => {
    setButtonPressed(!buttonPressed);
    announceMessage(`Toggle button is now ${!buttonPressed ? 'pressed' : 'not pressed'}`);
  };

  const toggleList = () => {
    setListExpanded(!listExpanded);
    announceMessage(`List is now ${!listExpanded ? 'expanded' : 'collapsed'}`);
  };

  return (
    <AccessibilitySupport>
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Accessibility Support System</h3>
          
          {/* Preferences Panel Trigger */}
          <div className="mb-6">
            <AccessibleButton
              onClick={() => setShowPreferences(true)}
              variant="primary"
              ariaLabel="Open accessibility preferences"
              className="mb-4"
            >
              <Type className="w-4 h-4 mr-2" />
              Accessibility Preferences
            </AccessibleButton>
            
            <p className="text-sm text-gray-600">
              Current preferences: High contrast: {preferences.highContrast ? 'On' : 'Off'}, 
              Font size: {preferences.fontSize}px, 
              Announcements: {preferences.announceChanges ? 'On' : 'Off'}
            </p>
          </div>

          {/* Form Examples */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Accessible Form Controls</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleInput
                  label="Username"
                  value={inputValue}
                  onChange={(value) => {
                    setInputValue(value);
                    validateInput(value);
                  }}
                  required
                  error={inputError}
                  help="Enter a username with at least 3 characters"
                  placeholder="Enter username"
                />
                
                <AccessibleInput
                  label="Email"
                  type="email"
                  help="We'll never share your email"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Interactive Elements */}
            <div>
              <h4 className="font-medium mb-3">Interactive Elements</h4>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <AccessibleButton
                  onClick={togglePressed}
                  pressed={buttonPressed}
                  variant="primary"
                  ariaLabel="Toggle button"
                  ariaDescription="Press to toggle the pressed state"
                >
                  {buttonPressed ? 'Pressed' : 'Not Pressed'}
                </AccessibleButton>
                
                <AccessibleButton
                  onClick={toggleList}
                  expanded={listExpanded}
                  variant="secondary"
                  ariaLabel="Expand options"
                  ariaDescription="Show or hide additional options"
                >
                  Options {listExpanded ? '▲' : '▼'}
                </AccessibleButton>
                
                <AccessibleButton
                  onClick={() => announceMessage('Action completed successfully', 'assertive')}
                  variant="primary"
                  ariaLabel="Test announcement"
                  ariaDescription="Triggers a screen reader announcement"
                >
                  Test Announcement
                </AccessibleButton>
              </div>

              {/* Expandable List */}
              {listExpanded && (
                <div
                  role="region"
                  aria-labelledby="options-heading"
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h5 id="options-heading" className="font-medium mb-2">Available Options</h5>
                  <ul role="list" className="space-y-2">
                    <li role="listitem">
                      <AccessibleButton
                        onClick={() => announceMessage('Option 1 selected')}
                        variant="secondary"
                        className="w-full text-left"
                        ariaLabel="Select option 1"
                      >
                        Option 1: Basic Settings
                      </AccessibleButton>
                    </li>
                    <li role="listitem">
                      <AccessibleButton
                        onClick={() => announceMessage('Option 2 selected')}
                        variant="secondary"
                        className="w-full text-left"
                        ariaLabel="Select option 2"
                      >
                        Option 2: Advanced Settings
                      </AccessibleButton>
                    </li>
                    <li role="listitem">
                      <AccessibleButton
                        onClick={() => announceMessage('Option 3 selected')}
                        variant="secondary"
                        className="w-full text-left"
                        ariaLabel="Select option 3"
                      >
                        Option 3: Expert Settings
                      </AccessibleButton>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Status Updates */}
            <div>
              <h4 className="font-medium mb-3">Status Updates</h4>
              <div
                role="status"
                aria-live="polite"
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm text-blue-700">
                  Status: All systems operational. Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Accessible Table */}
            <div>
              <h4 className="font-medium mb-3">Accessible Data Table</h4>
              <div className="overflow-x-auto">
                <table
                  role="table"
                  aria-label="User data table"
                  className="min-w-full border border-gray-200 rounded-lg"
                >
                  <caption className="text-sm text-gray-600 text-left p-2">
                    List of users with their roles and status
                  </caption>
                  <thead>
                    <tr role="row" className="bg-gray-50">
                      <th
                        role="columnheader"
                        scope="col"
                        className="px-4 py-2 text-left font-medium text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        className="px-4 py-2 text-left font-medium text-gray-900"
                      >
                        Role
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        className="px-4 py-2 text-left font-medium text-gray-900"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr role="row" className="border-t border-gray-200">
                      <td role="cell" className="px-4 py-2">John Doe</td>
                      <td role="cell" className="px-4 py-2">Administrator</td>
                      <td role="cell" className="px-4 py-2">
                        <span
                          role="status"
                          aria-label="Active status"
                          className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"
                        />
                        Active
                      </td>
                    </tr>
                    <tr role="row" className="border-t border-gray-200">
                      <td role="cell" className="px-4 py-2">Jane Smith</td>
                      <td role="cell" className="px-4 py-2">Editor</td>
                      <td role="cell" className="px-4 py-2">
                        <span
                          role="status"
                          aria-label="Away status"
                          className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"
                        />
                        Away
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Accessibility Features</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Screen reader announcements for all interactions</li>
              <li>• Proper ARIA labels and descriptions</li>
              <li>• Keyboard navigation support</li>
              <li>• High contrast mode available</li>
              <li>• Focus indicators and skip links</li>
              <li>• Semantic HTML structure</li>
              <li>• Live regions for dynamic content</li>
              <li>• Customizable accessibility preferences</li>
            </ul>
          </div>
        </div>

        {/* Preferences Panel */}
        <AccessibilityPreferencesPanel
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
        />
      </div>
    </AccessibilitySupport>
  );
};

export default AccessibilitySupport;