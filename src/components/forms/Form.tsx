import React, { createContext, useContext, useState, useCallback, useEffect, useRef, FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';

// Form Context Types
export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
  errors: Record<string, string>;
}

export interface FormContextValue {
  state: FormState;
  registerField: (name: string, value: any) => void;
  unregisterField: (name: string) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error?: string) => void;
  setFieldTouched: (name: string, touched?: boolean) => void;
  validateField: (name: string) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  resetField: (name: string) => void;
  getFieldProps: (name: string) => FormFieldProps;
}

export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  email?: boolean | string;
  url?: boolean | string;
  number?: boolean | string;
  integer?: boolean | string;
  custom?: (value: any, formValues: Record<string, any>) => string | Promise<string> | null | undefined;
}

export interface FormProps {
  initialValues?: Record<string, any>;
  validationSchema?: Record<string, ValidationRule>;
  onSubmit?: (values: Record<string, any>, actions: FormActions) => void | Promise<void>;
  onValidate?: (values: Record<string, any>) => Record<string, string> | Promise<Record<string, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  enableReinitialize?: boolean;
  children: React.ReactNode;
  className?: string;
  noValidate?: boolean;
}

export interface FormActions {
  setSubmitting: (isSubmitting: boolean) => void;
  setFieldError: (field: string, error?: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
}

export interface FormFieldProps {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

// Form Context
const FormContext = createContext<FormContextValue | null>(null);

// Custom hook to use form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
};

// Form component
export const Form: React.FC<FormProps> = ({
  initialValues = {},
  validationSchema = {},
  onSubmit,
  onValidate,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnMount = false,
  enableReinitialize = false,
  children,
  className = '',
  noValidate = true
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(() => {
    const fields: Record<string, FormField> = {};
    Object.entries(initialValues).forEach(([name, value]) => {
      fields[name] = {
        name,
        value,
        touched: false,
        dirty: false,
        valid: true
      };
    });

    return {
      fields,
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
      errors: {}
    };
  });

  // Validation helper
  const validateValue = useCallback(async (name: string, value: any, allValues: Record<string, any>): Promise<string | undefined> => {
    const rules = validationSchema[name];
    if (!rules) return undefined;

    // Required validation
    if (rules.required) {
      const isEmpty = value === null || value === undefined || value === '' || 
                     (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        const message = typeof rules.required === 'string' ? rules.required : `${name} is required`;
        return message;
      }
    }

    // Skip other validations if value is empty and not required
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    // String length validations
    if (typeof value === 'string') {
      if (rules.minLength) {
        const config = typeof rules.minLength === 'number' ? 
          { value: rules.minLength, message: `${name} must be at least ${rules.minLength} characters` } :
          rules.minLength;
        if (value.length < config.value) {
          return config.message;
        }
      }

      if (rules.maxLength) {
        const config = typeof rules.maxLength === 'number' ? 
          { value: rules.maxLength, message: `${name} must be no more than ${rules.maxLength} characters` } :
          rules.maxLength;
        if (value.length > config.value) {
          return config.message;
        }
      }
    }

    // Number validations
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = Number(value);
      
      if (rules.min) {
        const config = typeof rules.min === 'number' ? 
          { value: rules.min, message: `${name} must be at least ${rules.min}` } :
          rules.min;
        if (numValue < config.value) {
          return config.message;
        }
      }

      if (rules.max) {
        const config = typeof rules.max === 'number' ? 
          { value: rules.max, message: `${name} must be no more than ${rules.max}` } :
          rules.max;
        if (numValue > config.value) {
          return config.message;
        }
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string') {
      const config = rules.pattern instanceof RegExp ? 
        { value: rules.pattern, message: `${name} format is invalid` } :
        rules.pattern;
      if (!config.value.test(value)) {
        return config.message;
      }
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        const message = typeof rules.email === 'string' ? rules.email : 'Please enter a valid email address';
        return message;
      }
    }

    // URL validation
    if (rules.url && typeof value === 'string') {
      try {
        new URL(value);
      } catch {
        const message = typeof rules.url === 'string' ? rules.url : 'Please enter a valid URL';
        return message;
      }
    }

    // Number validation
    if (rules.number && isNaN(Number(value))) {
      const message = typeof rules.number === 'string' ? rules.number : 'Please enter a valid number';
      return message;
    }

    // Integer validation
    if (rules.integer && (!Number.isInteger(Number(value)) || isNaN(Number(value)))) {
      const message = typeof rules.integer === 'string' ? rules.integer : 'Please enter a valid integer';
      return message;
    }

    // Custom validation
    if (rules.custom) {
      try {
        const result = await rules.custom(value, allValues);
        if (result) return result;
      } catch (error) {
        return `Validation error: ${error}`;
      }
    }

    return undefined;
  }, [validationSchema]);

  // Register field
  const registerField = useCallback((name: string, value: any) => {
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          name,
          value,
          touched: false,
          dirty: false,
          valid: true
        }
      }
    }));
  }, []);

  // Unregister field
  const unregisterField = useCallback((name: string) => {
    setState(prev => {
      const { [name]: removed, ...restFields } = prev.fields;
      const { [name]: removedError, ...restErrors } = prev.errors;
      return {
        ...prev,
        fields: restFields,
        errors: restErrors
      };
    });
  }, []);

  // Set field value
  const setFieldValue = useCallback(async (name: string, value: any) => {
    // First update the state with new value
    setState(prev => {
      // Create a copy of the updated fields with the new value
      const updatedFields = {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          value,
          dirty: true
        }
      };
      
      // Start with the current state
      const newState = {
        ...prev,
        fields: updatedFields,
        isDirty: true
      };
      
      // Handle validation in the same state update if needed
      if (validateOnChange) {
        // Schedule validation to run after state update
        setTimeout(async () => {
          const allValues = Object.fromEntries(
            Object.entries(updatedFields).map(([k, v]) => [k, v.value])
          );
          
          const error = await validateValue(name, value, allValues);
          
          // Update state directly for the error
          setState(currentState => {
            // If there's an error, add it
            if (error) {
              return {
                ...currentState,
                fields: {
                  ...currentState.fields,
                  [name]: {
                    ...currentState.fields[name],
                    valid: false
                  }
                },
                errors: {
                  ...currentState.errors,
                  [name]: error
                }
              };
            } 
            // If no error, remove any existing error
            else if (currentState.errors[name]) {
              const { [name]: removed, ...restErrors } = currentState.errors;
              return {
                ...currentState,
                fields: {
                  ...currentState.fields,
                  [name]: {
                    ...currentState.fields[name],
                    valid: true
                  }
                },
                errors: restErrors
              };
            }
            
            return currentState;
          });
        }, 0);
      }
      
      return newState;
    });
  }, [validateOnChange, validateValue]);

  // Set field error
  const setFieldError = useCallback((name: string, error?: string) => {
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          valid: !error
        }
      },
      errors: error ? { ...prev.errors, [name]: error } : (() => {
        const { [name]: removed, ...rest } = prev.errors;
        return rest;
      })()
    }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback(async (name: string, touched: boolean = true) => {
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          touched
        }
      }
    }));

    // Validate on blur if enabled
    if (validateOnBlur && touched) {
      const field = state.fields[name];
      if (field) {
        const allValues = Object.fromEntries(Object.entries(state.fields).map(([k, v]) => [k, v.value]));
        const error = await validateValue(name, field.value, allValues);
        setFieldError(name, error);
      }
    }
  }, [state.fields, validateOnBlur, validateValue]);

  // Validate single field
  const validateField = useCallback(async (name: string): Promise<boolean> => {
    const field = state.fields[name];
    if (!field) return true;

    const allValues = Object.fromEntries(Object.entries(state.fields).map(([k, v]) => [k, v.value]));
    const error = await validateValue(name, field.value, allValues);
    setFieldError(name, error);
    return !error;
  }, [state.fields, validateValue, setFieldError]);

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    const allValues = Object.fromEntries(Object.entries(state.fields).map(([k, v]) => [k, v.value]));
    const errors: Record<string, string> = {};

    // Validate each field
    await Promise.all(
      Object.keys(state.fields).map(async (name) => {
        const field = state.fields[name];
        const error = await validateValue(name, field.value, allValues);
        if (error) {
          errors[name] = error;
        }
      })
    );

    // Custom form validation
    if (onValidate) {
      try {
        const customErrors = await onValidate(allValues);
        Object.assign(errors, customErrors);
      } catch (error) {
        console.error('Form validation error:', error);
      }
    }

    // Update state with errors
    setState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
      fields: Object.fromEntries(
        Object.entries(prev.fields).map(([name, field]) => [
          name,
          { ...field, valid: !errors[name] }
        ])
      )
    }));

    return Object.keys(errors).length === 0;
  }, [state.fields, validateValue, onValidate]);

  // Reset form
  const resetForm = useCallback(() => {
    setState({
      fields: Object.fromEntries(
        Object.entries(initialValues).map(([name, value]) => [
          name,
          { name, value, touched: false, dirty: false, valid: true }
        ])
      ),
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
      errors: {}
    });
  }, [initialValues]);

  // Reset single field
  const resetField = useCallback((name: string) => {
    const initialValue = initialValues[name];
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          name,
          value: initialValue,
          touched: false,
          dirty: false,
          valid: true
        }
      },
      errors: (() => {
        const { [name]: removed, ...rest } = prev.errors;
        return rest;
      })()
    }));
  }, [initialValues]);

  // Get field props
  const getFieldProps = useCallback((name: string): FormFieldProps => {
    const field = state.fields[name] || {
      name,
      value: '',
      touched: false,
      dirty: false,
      valid: true
    };

    return {
      ...field,
      error: state.errors[name],
      onChange: (value: any) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true)
    };
  }, [state.fields, state.errors, setFieldValue, setFieldTouched]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (state.isSubmitting) return;

    setState(prev => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }));

    try {
      // Mark all fields as touched
      setState(prev => ({
        ...prev,
        fields: Object.fromEntries(
          Object.entries(prev.fields).map(([name, field]) => [
            name,
            { ...field, touched: true }
          ])
        )
      }));

      // Validate form
      const isValid = await validateForm();
      
      if (isValid && onSubmit) {
        const values = Object.fromEntries(
          Object.entries(state.fields).map(([name, field]) => [name, field.value])
        );

        const actions: FormActions = {
          setSubmitting: (isSubmitting: boolean) => 
            setState(prev => ({ ...prev, isSubmitting })),
          setFieldError,
          setErrors: (errors: Record<string, string>) =>
            setState(prev => ({ ...prev, errors })),
          resetForm
        };

        await onSubmit(values, actions);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.isSubmitting, state.fields, validateForm, onSubmit, setFieldError, resetForm]);

  // Validate on mount
  useEffect(() => {
    if (validateOnMount) {
      validateForm();
    }
  }, [validateOnMount, validateForm]);

  // Reinitialize form when initial values change
  useEffect(() => {
    if (enableReinitialize) {
      resetForm();
    }
  }, [enableReinitialize, initialValues, resetForm]);

  // Update form validity
  useEffect(() => {
    const isValid = Object.keys(state.errors).length === 0;
    const isDirty = Object.values(state.fields).some(field => field.dirty);
    
    setState(prev => ({
      ...prev,
      isValid,
      isDirty
    }));
  }, [state.errors, state.fields]);

  const contextValue: FormContextValue = {
    state,
    registerField,
    unregisterField,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    resetField,
    getFieldProps
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate={noValidate}
        className={className}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

// Form Field wrapper component
export interface FormFieldWrapperProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  children: (props: FormFieldProps) => React.ReactNode;
  className?: string;
  showError?: boolean;
}

export const FormField: React.FC<FormFieldWrapperProps> = ({
  name,
  label,
  description,
  required = false,
  children,
  className = '',
  showError = true
}) => {
  const { getFieldProps } = useFormContext();
  const fieldProps = getFieldProps(name);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      
      {children(fieldProps)}
      
      {showError && fieldProps.error && fieldProps.touched && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{fieldProps.error}</span>
        </div>
      )}
    </div>
  );
};

// Form Actions component
export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = '',
  align = 'right'
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`flex items-center space-x-3 ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

// Form Status component
export interface FormStatusProps {
  className?: string;
}

export const FormStatus: React.FC<FormStatusProps> = ({ className = '' }) => {
  const { state } = useFormContext();

  if (Object.keys(state.errors).length === 0) {
    return null;
  }

  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There {Object.keys(state.errors).length === 1 ? 'is' : 'are'} {Object.keys(state.errors).length} error{Object.keys(state.errors).length !== 1 ? 's' : ''} with your submission
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {Object.entries(state.errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form validation hooks
export const useFormValidation = () => {
  const { validateForm, validateField, state } = useFormContext();
  
  return {
    validateForm,
    validateField,
    isValid: state.isValid,
    errors: state.errors,
    hasErrors: Object.keys(state.errors).length > 0
  };
};

export const useFormState = () => {
  const { state } = useFormContext();
  return state;
};

export const useFormActions = () => {
  const { setFieldValue, setFieldError, setFieldTouched, resetForm, resetField } = useFormContext();
  
  return {
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    resetField
  };
};

export default Form;