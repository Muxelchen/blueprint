// Complete client-side validation utilities
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};

export type ValidatorFunction = (value: any, options?: any) => ValidationResult;

// Basic validation functions
export const required = (value: any): ValidationResult => {
  const isValid = value !== null && value !== undefined && value !== '';
  return {
    isValid,
    errors: isValid ? [] : ['This field is required'],
  };
};

export const minLength = (value: string, min: number): ValidationResult => {
  const length = value ? value.length : 0;
  const isValid = length >= min;
  return {
    isValid,
    errors: isValid ? [] : [`Minimum length is ${min} characters`],
  };
};

export const maxLength = (value: string, max: number): ValidationResult => {
  const length = value ? value.length : 0;
  const isValid = length <= max;
  return {
    isValid,
    errors: isValid ? [] : [`Maximum length is ${max} characters`],
  };
};

export const minValue = (value: number, min: number): ValidationResult => {
  const isValid = value >= min;
  return {
    isValid,
    errors: isValid ? [] : [`Minimum value is ${min}`],
  };
};

export const maxValue = (value: number, max: number): ValidationResult => {
  const isValid = value <= max;
  return {
    isValid,
    errors: isValid ? [] : [`Maximum value is ${max}`],
  };
};

export const pattern = (value: string, regex: RegExp, message?: string): ValidationResult => {
  const isValid = regex.test(value);
  return {
    isValid,
    errors: isValid ? [] : [message || 'Invalid format'],
  };
};

// Email validation
export const email = (value: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern(value, emailRegex, 'Please enter a valid email address');
};

// Phone validation
export const phone = (value: string, format: 'US' | 'international' = 'US'): ValidationResult => {
  const cleaned = value.replace(/\D/g, '');

  if (format === 'US') {
    const isValid = cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
    return {
      isValid,
      errors: isValid ? [] : ['Please enter a valid US phone number'],
    };
  }

  // International format - basic validation
  const isValid = cleaned.length >= 7 && cleaned.length <= 15;
  return {
    isValid,
    errors: isValid ? [] : ['Please enter a valid phone number'],
  };
};

// URL validation
export const url = (value: string): ValidationResult => {
  try {
    new URL(value);
    return { isValid: true, errors: [] };
  } catch {
    return { isValid: false, errors: ['Please enter a valid URL'] };
  }
};

// Password validation
export const password = (
  value: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const errors: string[] = [];

  if (value.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(value)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(value)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(value)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Credit card validation
export const creditCard = (value: string): ValidationResult => {
  const cleaned = value.replace(/\D/g, '');

  // Luhn algorithm - start with isEven = false since we process right to left
  // and we want to double every second digit starting from the second-to-last
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0 && cleaned.length >= 13 && cleaned.length <= 19;

  return {
    isValid,
    errors: isValid ? [] : ['Please enter a valid credit card number'],
  };
};

// Date validation
export const dateRange = (
  value: Date | string,
  min?: Date | string,
  max?: Date | string
): ValidationResult => {
  const date = new Date(value);
  const errors: string[] = [];

  if (isNaN(date.getTime())) {
    return { isValid: false, errors: ['Please enter a valid date'] };
  }

  if (min) {
    const minDate = new Date(min);
    if (date < minDate) {
      errors.push(`Date must be after ${minDate.toLocaleDateString()}`);
    }
  }

  if (max) {
    const maxDate = new Date(max);
    if (date > maxDate) {
      errors.push(`Date must be before ${maxDate.toLocaleDateString()}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Age validation
export const age = (
  birthDate: Date | string,
  minAge: number,
  maxAge?: number
): ValidationResult => {
  const birth = new Date(birthDate);
  const today = new Date();

  // More accurate age calculation that considers month and day
  const yearDiff = today.getFullYear() - birth.getFullYear();
  // Adjust age if birthday hasn't occurred yet this year
  const hasBirthdayOccurredThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  const age = hasBirthdayOccurredThisYear ? yearDiff : yearDiff - 1;

  const errors: string[] = [];

  if (age < minAge) {
    errors.push(`You must be at least ${minAge} years old`);
  }

  if (maxAge && age > maxAge) {
    errors.push(`You must be under ${maxAge} years old`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// File validation
export const file = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}
): ValidationResult => {
  const { maxSize, allowedTypes } = options;
  const errors: string[] = [];

  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Custom validation composer
export const compose = (...validators: ValidatorFunction[]) => {
  return (value: any, options?: any): ValidationResult => {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    let isValid = true;

    for (const validator of validators) {
      const result = validator(value, options);
      if (!result.isValid) {
        isValid = false;
        allErrors.push(...result.errors);
      }
      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    }

    return {
      isValid,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  };
};

// Conditional validation
export const when = (condition: (value: any) => boolean, validator: ValidatorFunction) => {
  return (value: any, options?: any): ValidationResult => {
    if (!condition(value)) {
      return { isValid: true, errors: [] };
    }
    return validator(value, options);
  };
};

// Form validation helper
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidatorFunction>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    if (!result.isValid) {
      isValid = false;
      errors[field] = result.errors;
    }
  }

  return { isValid, errors };
};

// Real-time validation with debounce
export const createDebouncedValidator = (validator: ValidatorFunction, delay = 300) => {
  let timeoutId: number;

  return (value: any, callback: (result: ValidationResult) => void) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      const result = validator(value);
      callback(result);
    }, delay);
  };
};

// Async validation wrapper
export const asyncValidation = async (
  value: any,
  asyncValidator: (value: any) => Promise<ValidationResult>
): Promise<ValidationResult> => {
  try {
    return await asyncValidator(value);
  } catch (error) {
    return {
      isValid: false,
      errors: ['Validation error occurred'],
    };
  }
};

// Common validation rules
export const ValidationRules = {
  required,
  email,
  phone,
  url,
  password,
  creditCard,
  minLength,
  maxLength,
  minValue,
  maxValue,
  pattern,
  dateRange,
  age,
  file,
  compose,
  when,
};

export default ValidationRules;
