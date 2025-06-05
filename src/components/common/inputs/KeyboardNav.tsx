import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { Keyboard, Eye, ArrowUp } from 'lucide-react';

export interface KeyboardNavProps {
  enabled?: boolean;
  showIndicator?: boolean;
  focusOnMount?: boolean;
  trapFocus?: boolean;
  skipLinks?: boolean;
  customKeyBindings?: Record<string, () => void>;
  className?: string;
  children: React.ReactNode;
}

export interface FocusableElement {
  element: HTMLElement;
  tabIndex: number;
  role?: string;
  ariaLabel?: string;
}

interface KeyboardNavContextType {
  enabled: boolean;
  currentFocusIndex: number;
  focusableElements: FocusableElement[];
  setEnabled: (enabled: boolean) => void;
  registerElement: (element: HTMLElement) => void;
  unregisterElement: (element: HTMLElement) => void;
  focusNext: () => void;
  focusPrevious: () => void;
  focusFirst: () => void;
  focusLast: () => void;
}

const KeyboardNavContext = createContext<KeyboardNavContextType | undefined>(undefined);

export const useKeyboardNav = () => {
  const context = useContext(KeyboardNavContext);
  if (!context) {
    throw new Error('useKeyboardNav must be used within a KeyboardNavProvider');
  }
  return context;
};

const KeyboardNav: React.FC<KeyboardNavProps> = ({
  enabled = true,
  showIndicator = true,
  focusOnMount = false,
  trapFocus = false,
  skipLinks = true,
  customKeyBindings = {},
  className = '',
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState<FocusableElement[]>([]);
  const [keyboardUser, setKeyboardUser] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Default focusable selectors
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[contenteditable="true"]'
  ].join(', ');

  // Update focusable elements
  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    const focusableList: FocusableElement[] = elements
      .filter(el => {
        const computedStyle = window.getComputedStyle(el);
        return (
          computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden' &&
          !el.hasAttribute('aria-hidden') &&
          el.offsetParent !== null
        );
      })
      .map(el => ({
        element: el,
        tabIndex: el.tabIndex,
        role: el.getAttribute('role') || undefined,
        ariaLabel: el.getAttribute('aria-label') || el.textContent?.trim() || undefined
      }))
      .sort((a, b) => {
        if (a.tabIndex === b.tabIndex) {
          return 0;
        }
        if (a.tabIndex === 0 && b.tabIndex > 0) {
          return 1;
        }
        if (a.tabIndex > 0 && b.tabIndex === 0) {
          return -1;
        }
        return a.tabIndex - b.tabIndex;
      });

    setFocusableElements(focusableList);
  }, [focusableSelectors]);

  // Focus management functions
  const focusElement = useCallback((index: number) => {
    if (index >= 0 && index < focusableElements.length) {
      focusableElements[index].element.focus();
      setCurrentFocusIndex(index);
    }
  }, [focusableElements]);

  const focusNext = useCallback(() => {
    const nextIndex = currentFocusIndex + 1;
    if (nextIndex < focusableElements.length) {
      focusElement(nextIndex);
    } else if (trapFocus) {
      focusElement(0);
    }
  }, [currentFocusIndex, focusableElements.length, focusElement, trapFocus]);

  const focusPrevious = useCallback(() => {
    const prevIndex = currentFocusIndex - 1;
    if (prevIndex >= 0) {
      focusElement(prevIndex);
    } else if (trapFocus) {
      focusElement(focusableElements.length - 1);
    }
  }, [currentFocusIndex, focusableElements.length, focusElement, trapFocus]);

  const focusFirst = useCallback(() => {
    focusElement(0);
  }, [focusElement]);

  const focusLast = useCallback(() => {
    focusElement(focusableElements.length - 1);
  }, [focusElement, focusableElements.length]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    setKeyboardUser(true);

    // Handle custom key bindings first
    const key = event.key.toLowerCase();
    const keyCombo = [
      event.ctrlKey && 'ctrl',
      event.altKey && 'alt',
      event.shiftKey && 'shift',
      key
    ].filter(Boolean).join('+');

    if (customKeyBindings[keyCombo]) {
      event.preventDefault();
      customKeyBindings[keyCombo]();
      return;
    }

    // Default keyboard navigation
    switch (event.key) {
      case 'Tab':
        if (trapFocus) {
          event.preventDefault();
          if (event.shiftKey) {
            focusPrevious();
          } else {
            focusNext();
          }
        }
        break;

      case 'ArrowDown':
        if (event.target && ['input', 'textarea', 'select'].includes((event.target as HTMLElement).tagName.toLowerCase())) {
          return;
        }
        event.preventDefault();
        focusNext();
        break;

      case 'ArrowUp':
        if (event.target && ['input', 'textarea', 'select'].includes((event.target as HTMLElement).tagName.toLowerCase())) {
          return;
        }
        event.preventDefault();
        focusPrevious();
        break;

      case 'Home':
        if (event.ctrlKey) {
          event.preventDefault();
          focusFirst();
        }
        break;

      case 'End':
        if (event.ctrlKey) {
          event.preventDefault();
          focusLast();
        }
        break;

      case 'Escape':
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        }
        break;

      case 'F1':
        event.preventDefault();
        setShowKeyboardHelp(!showKeyboardHelp);
        break;

      case '?':
        if (event.shiftKey) {
          event.preventDefault();
          setShowKeyboardHelp(!showKeyboardHelp);
        }
        break;
    }
  }, [isEnabled, customKeyBindings, trapFocus, focusNext, focusPrevious, focusFirst, focusLast, showKeyboardHelp]);

  // Mouse event handler to detect non-keyboard users
  const handleMouseDown = useCallback(() => {
    setKeyboardUser(false);
  }, []);

  // Focus event handler
  const handleFocus = useCallback((event: FocusEvent) => {
    if (!isEnabled) return;

    const target = event.target as HTMLElement;
    const index = focusableElements.findIndex(item => item.element === target);
    if (index >= 0) {
      setCurrentFocusIndex(index);
    }
  }, [isEnabled, focusableElements]);

  // Element registration functions
  const registerElement = useCallback((_element: HTMLElement) => {
    // Element registration logic would go here
    // Currently unused but keeping for future implementation
  }, []);

  const unregisterElement = useCallback((_element: HTMLElement) => {
    // Element unregistration logic would go here  
    // Currently unused but keeping for future implementation
  }, []);

  // Effects
  useEffect(() => {
    updateFocusableElements();
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      // Clean up event listeners to prevent memory leaks
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [updateFocusableElements, handleKeyDown, handleMouseDown]);

  useEffect(() => {
    if (focusOnMount && focusableElements.length > 0) {
      focusFirst();
    }
  }, [focusOnMount, focusableElements.length, focusFirst]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('focus', handleFocus, true);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('focus', handleFocus, true);
    };
  }, [handleKeyDown, handleMouseDown, handleFocus]);

  const contextValue: KeyboardNavContextType = {
    enabled: isEnabled,
    currentFocusIndex,
    focusableElements,
    setEnabled: setIsEnabled,
    registerElement,
    unregisterElement,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  };

  return (
    <KeyboardNavContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={`keyboard-nav-container ${className}`}
        tabIndex={-1}
      >
        {/* Skip Links */}
        {skipLinks && (
          <div className="sr-only focus-within:not-sr-only">
            <button
              onClick={focusFirst}
              className="absolute top-0 left-0 z-50 p-2 bg-blue-600 text-white rounded-br-md focus:outline-none"
            >
              Skip to main content
            </button>
          </div>
        )}

        {/* Keyboard Indicator */}
        {showIndicator && keyboardUser && isEnabled && (
          <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg text-sm">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Navigation Active
            </div>
          </div>
        )}

        {/* Keyboard Help Modal */}
        {showKeyboardHelp && (
          <KeyboardHelpModal onClose={() => setShowKeyboardHelp(false)} />
        )}

        {children}
      </div>
    </KeyboardNavContext.Provider>
  );
};

// Keyboard Help Modal Component
const KeyboardHelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Tab', description: 'Navigate to next element' },
    { key: 'Shift + Tab', description: 'Navigate to previous element' },
    { key: '↓ Arrow Down', description: 'Move focus down' },
    { key: '↑ Arrow Up', description: 'Move focus up' },
    { key: 'Ctrl + Home', description: 'Go to first element' },
    { key: 'Ctrl + End', description: 'Go to last element' },
    { key: 'Enter', description: 'Activate focused element' },
    { key: 'Space', description: 'Activate buttons/checkboxes' },
    { key: 'Escape', description: 'Close modals/menus' },
    { key: 'F1 or ?', description: 'Show/hide this help' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = () => {
  const [keyboardMode, setKeyboardMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setKeyboardMode(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardMode(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { keyboardMode };
};

// Focusable Component Wrapper
export const Focusable: React.FC<{
  children: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onFocus, onBlur, disabled = false, className = '' }) => {
  const { registerElement, unregisterElement } = useKeyboardNav();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element && !disabled) {
      registerElement(element);
      return () => unregisterElement(element);
    }
  }, [registerElement, unregisterElement, disabled]);

  return (
    <div
      ref={elementRef}
      tabIndex={disabled ? -1 : 0}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'} ${className}`}
    >
      {children}
    </div>
  );
};

// Example usage component
export const ExampleKeyboardNav: React.FC = () => {
  const [trapFocus, setTrapFocus] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const [customBindings, setCustomBindings] = useState(false);

  const customKeyBindings: Record<string, () => void> = customBindings ? {
    'ctrl+k': () => alert('Custom shortcut: Ctrl+K pressed!'),
    'alt+h': () => alert('Custom shortcut: Alt+H pressed!'),
    'ctrl+shift+d': () => alert('Custom shortcut: Ctrl+Shift+D pressed!')
  } : {};

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Keyboard Navigation System</h3>
        
        {/* Controls */}
        <div className="space-y-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900">Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={trapFocus}
                onChange={(e) => setTrapFocus(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Trap Focus</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showIndicator}
                onChange={(e) => setShowIndicator(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Indicator</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customBindings}
                onChange={(e) => setCustomBindings(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Custom Shortcuts</span>
            </label>
          </div>
        </div>

        {/* Demo Area */}
        <KeyboardNav
          trapFocus={trapFocus}
          showIndicator={showIndicator}
          customKeyBindings={customKeyBindings}
          skipLinks={true}
          className="border border-gray-300 rounded-lg p-6 bg-white"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Form Elements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Interactive Elements</h4>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Primary Button
                </button>
                
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Secondary Button
                </button>
                
                <a
                  href="#"
                  className="px-4 py-2 text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  onClick={(e) => e.preventDefault()}
                >
                  Link Example
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Selection Controls</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>Checkbox option</span>
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="example"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    <span>Radio option 1</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="example"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    <span>Radio option 2</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Custom Focusable Elements</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Focusable className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm">Custom Card 1</p>
                  </div>
                </Focusable>
                
                <Focusable className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Keyboard className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm">Custom Card 2</p>
                  </div>
                </Focusable>
                
                <Focusable className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <ArrowUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm">Custom Card 3</p>
                  </div>
                </Focusable>
              </div>
            </div>
          </div>
        </KeyboardNav>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to Test</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Tab</kbd> to navigate between elements</li>
            <li>• Use <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">↑</kbd> <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">↓</kbd> arrow keys for vertical navigation</li>
            <li>• Press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">F1</kbd> or <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">?</kbd> to show keyboard shortcuts</li>
            <li>• Try <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+Home</kbd> and <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+End</kbd> to jump to first/last element</li>
            {customBindings && (
              <>
                <li>• Press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+K</kbd>, <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Alt+H</kbd>, or <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+Shift+D</kbd> for custom shortcuts</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KeyboardNav;