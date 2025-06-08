import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
  custom?: (value: string) => string | null;
}

export interface InputFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  validation?: ValidationRule;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showCharCount?: boolean;
  autoComplete?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  onValidation?: (isValid: boolean, errors: string[]) => void;
  className?: string;
  inputClassName?: string;
  name?: string;
  id?: string;
}

export interface InputFieldState {
  value: string;
  isFocused: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: string[];
  showPassword: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  value: controlledValue,
  defaultValue = '',
  placeholder,
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  validation = {},
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  clearable = false,
  showCharCount = false,
  autoComplete,
  onChange,
  onBlur,
  onFocus,
  onValidation,
  className = '',
  inputClassName = '',
  name,
  id,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;

  const [state, setState] = useState<InputFieldState>({
    value: controlledValue || defaultValue,
    isFocused: false,
    isDirty: false,
    isValid: true,
    errors: [],
    showPassword: false,
  });

  // Update state when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== state.value) {
      setState(prev => ({ ...prev, value: controlledValue }));
    }
  }, [controlledValue, isControlled]);

  // Validation function
  const validateValue = useCallback(
    (value: string) => {
      const errors: string[] = [];

      if (validation.required && !value.trim()) {
        errors.push('This field is required');
      }

      if (value.trim() && validation.minLength && value.length < validation.minLength) {
        errors.push(`Minimum length is ${validation.minLength} characters`);
      }

      if (value.trim() && validation.maxLength && value.length > validation.maxLength) {
        errors.push(`Maximum length is ${validation.maxLength} characters`);
      }

      if (value.trim() && validation.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          errors.push('Please enter a valid email address');
        }
      }

      if (value.trim() && validation.number) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push('Please enter a valid number');
        } else {
          if (validation.min !== undefined && numValue < validation.min) {
            errors.push(`Value must be at least ${validation.min}`);
          }
          if (validation.max !== undefined && numValue > validation.max) {
            errors.push(`Value must be at most ${validation.max}`);
          }
        }
      }

      if (value.trim() && validation.pattern && !validation.pattern.test(value)) {
        errors.push('Please enter a value in the correct format');
      }

      if (validation.custom) {
        const customError = validation.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }

      const isValid = errors.length === 0;
      return { isValid, errors };
    },
    [validation]
  );

  // Handle value change
  const handleValueChange = useCallback(
    (newValue: string) => {
      const { isValid, errors } = validateValue(newValue);

      setState(prev => ({
        ...prev,
        value: newValue,
        isDirty: true,
        isValid,
        errors,
      }));

      onChange?.(newValue);
      onValidation?.(isValid, errors);
    },
    [onChange, onValidation, validateValue]
  );

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
    onFocus?.(state.value);
  }, [onFocus, state.value]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
    onBlur?.(state.value);
  }, [onBlur, state.value]);

  const handleClear = useCallback(() => {
    handleValueChange('');
    inputRef.current?.focus();
  }, [handleValueChange]);

  const togglePasswordVisibility = useCallback(() => {
    setState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  // Styles
  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    const variants = {
      default:
        'border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      outline: 'border-2 border-gray-300 bg-transparent focus:border-blue-500',
      ghost: 'border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500',
    };
    return variants[variant];
  };

  const getStateClasses = () => {
    if (disabled) return 'bg-gray-100 text-gray-500 cursor-not-allowed';
    if (readOnly) return 'bg-gray-50 cursor-default';
    if (state.isDirty && !state.isValid)
      return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (state.isDirty && state.isValid && state.value.trim())
      return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return '';
  };

  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const actualType = type === 'password' && state.showPassword ? 'text' : type;
  const showPasswordToggle = type === 'password';
  const showClearButton = clearable && state.value && !disabled && !readOnly;
  const showValidationIcon = state.isDirty && (state.isValid || !state.isValid);

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && <p className="text-sm text-gray-600">{description}</p>}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={actualType}
          id={inputId}
          name={name}
          value={state.value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          required={required}
          onChange={e => handleValueChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full rounded-md transition-colors duration-200
            ${getSizeClasses()}
            ${getVariantClasses()}
            ${getStateClasses()}
            ${leftIcon ? 'pl-10' : ''}
            ${showPasswordToggle || showClearButton || showValidationIcon || rightIcon ? 'pr-10' : ''}
            ${inputClassName}
          `}
        />

        {/* Right Side Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Custom Right Icon */}
          {rightIcon && !showPasswordToggle && !showClearButton && !showValidationIcon && (
            <div className="text-gray-400">{rightIcon}</div>
          )}

          {/* Validation Icon */}
          {showValidationIcon && (
            <div className={state.isValid ? 'text-green-500' : 'text-red-500'}>
              {state.isValid ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
          )}

          {/* Clear Button */}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {state.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Character Count */}
      {showCharCount && validation.maxLength && (
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              state.value.length > validation.maxLength
                ? 'text-red-500'
                : state.value.length > validation.maxLength * 0.8
                  ? 'text-yellow-500'
                  : 'text-gray-500'
            }`}
          >
            {state.value.length}/{validation.maxLength}
          </span>
        </div>
      )}

      {/* Error Messages */}
      {state.isDirty && state.errors.length > 0 && (
        <div className="space-y-1">
          {state.errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// Form validation hook
export const useFormValidation = () => {
  const [formState, setFormState] = useState<
    Record<string, { isValid: boolean; errors: string[] }>
  >({});

  const updateFieldValidation = useCallback(
    (fieldName: string, isValid: boolean, errors: string[]) => {
      setFormState(prev => ({
        ...prev,
        [fieldName]: { isValid, errors },
      }));
    },
    []
  );

  const isFormValid = Object.values(formState).every(field => field.isValid);
  const getFieldErrors = (fieldName: string) => formState[fieldName]?.errors || [];
  const isFieldValid = (fieldName: string) => formState[fieldName]?.isValid ?? true;

  return {
    formState,
    isFormValid,
    getFieldErrors,
    isFieldValid,
    updateFieldValidation,
  };
};

// Example usage component
export const ExampleInputFields: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    age: '',
    website: '',
    search: '',
  });

  const { isFormValid, updateFieldValidation } = useFormValidation();

  const handleFieldChange = (fieldName: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Input Field Examples</h3>

        <div className="space-y-6">
          {/* Email Input */}
          <InputField
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleFieldChange('email')}
            onValidation={(isValid, errors) => updateFieldValidation('email', isValid, errors)}
            validation={{
              required: true,
              email: true,
            }}
            clearable
            required
          />

          {/* Password Input */}
          <InputField
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleFieldChange('password')}
            onValidation={(isValid, errors) => updateFieldValidation('password', isValid, errors)}
            validation={{
              required: true,
              minLength: 8,
              custom: value => {
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                  return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                }
                return null;
              },
            }}
            description="Password must be at least 8 characters with uppercase, lowercase, and number"
            required
          />

          {/* Username Input */}
          <InputField
            type="text"
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleFieldChange('username')}
            onValidation={(isValid, errors) => updateFieldValidation('username', isValid, errors)}
            validation={{
              required: true,
              minLength: 3,
              maxLength: 20,
              pattern: /^[a-zA-Z0-9_]+$/,
              custom: value => {
                if (value.toLowerCase() === 'admin' || value.toLowerCase() === 'root') {
                  return 'This username is not allowed';
                }
                return null;
              },
            }}
            showCharCount
            clearable
            required
          />

          {/* Age Input */}
          <InputField
            type="number"
            label="Age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleFieldChange('age')}
            onValidation={(isValid, errors) => updateFieldValidation('age', isValid, errors)}
            validation={{
              required: true,
              number: true,
              min: 13,
              max: 120,
            }}
            size="sm"
            required
          />

          {/* Website Input */}
          <InputField
            type="url"
            label="Website"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleFieldChange('website')}
            validation={{
              pattern: /^https?:\/\/.+\..+/,
            }}
            variant="outline"
          />

          {/* Search Input */}
          <InputField
            type="search"
            placeholder="Search..."
            value={formData.search}
            onChange={handleFieldChange('search')}
            variant="ghost"
            size="lg"
            clearable
          />
        </div>

        {/* Form Status */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Form Status</h4>
          <p className={`text-sm ${isFormValid ? 'text-green-600' : 'text-red-600'}`}>
            Form is {isFormValid ? 'valid' : 'invalid'}
          </p>

          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Form Data:</h5>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputField;
