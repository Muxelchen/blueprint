// Complete form types and interfaces
import { BaseComponent, ComponentSize } from './index';

// Base form types
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'range'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'color'
  | 'rich-text'
  | 'autocomplete'
  | 'tags'
  | 'rating'
  | 'custom';

export type ValidationRule =
  | 'required'
  | 'email'
  | 'url'
  | 'phone'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom';

// Conditional configuration
export interface ConditionalConfig {
  field: string;
  value: any;
  operator?: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  action?: 'show' | 'hide' | 'enable' | 'disable';
}

// Base form field interface
export interface BaseFormField extends BaseComponent {
  name: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  value?: any;
  defaultValue?: any;
  onChange?: (value: any, event?: Event) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  validation?: ValidationConfig;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
  valid?: boolean;
}

// Validation configuration
export interface ValidationConfig {
  rules: ValidationRule[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string | RegExp;
  custom?: {
    validator: (value: any, formData?: any) => boolean | string | Promise<boolean | string>;
    message?: string;
    async?: boolean;
  };
  debounce?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

// Select option interface
export interface SelectOption {
  value: any;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

// Form field specific types
export interface TextFieldProps extends BaseFormField {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
}

export interface SelectFieldProps extends BaseFormField {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  noOptionsMessage?: string;
}

export interface CheckboxProps extends BaseFormField {
  checked?: boolean;
  indeterminate?: boolean;
  label?: string;
  color?: string;
  size?: ComponentSize;
}

export interface RadioGroupProps extends BaseFormField {
  options: SelectOption[];
  direction?: 'row' | 'column';
  color?: string;
  size?: ComponentSize;
}

export interface SwitchProps extends BaseFormField {
  checked?: boolean;
  label?: string;
  color?: string;
  size?: ComponentSize;
}

export interface SliderProps extends BaseFormField {
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
}

export interface DateFieldProps extends BaseFormField {
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
}

export interface FileFieldProps extends BaseFormField {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  dropzone?: boolean;
  preview?: boolean;
  showFileList?: boolean;
  capture?: boolean | 'user' | 'environment';
  onDrop?: (acceptedFiles: File[], rejectedFiles: File[]) => void;
  onDropAccepted?: (files: File[]) => void;
  onDropRejected?: (files: File[]) => void;
  onFileDialogCancel?: () => void;
  getFilesFromEvent?: (event: Event) => Promise<File[]>;
  validator?: (file: File) => string | null;
  preventDropOnDocument?: boolean;
  noClick?: boolean;
  noKeyboard?: boolean;
  noDrag?: boolean;
  noDragEventsBubbling?: boolean;
  useFsAccessApi?: boolean;
  autoFocus?: boolean;
}

export interface FilePreview {
  file: File;
  url: string;
  preview?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
}

// Rich text editor types
export interface RichTextEditorProps extends BaseFormField {
  toolbar?: string[] | boolean;
  toolbarPosition?: 'top' | 'bottom';
  theme?: 'snow' | 'bubble' | 'custom';
  formats?: string[];
  modules?: Record<string, any>;
  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;
  tabIndex?: number;
  preserveWhitespace?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  onSelectionChange?: (range: any, source: string, editor: any) => void;
  onTextChange?: (delta: any, oldDelta: any, source: string) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

// Rating field types
export interface RatingProps extends BaseFormField {
  max?: number;
  precision?: number;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  size?: ComponentSize;
  color?: string;
  readOnly?: boolean;
  disabled?: boolean;
  getLabelText?: (value: number) => string;
  highlightSelectedOnly?: boolean;
  IconContainerComponent?: React.ComponentType<any>;
  emptyLabelText?: string;
}

// Color picker types
export interface ColorPickerProps extends BaseFormField {
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv';
  alpha?: boolean;
  presets?: string[];
  presetColumns?: number;
  showInput?: boolean;
  showPresets?: boolean;
  showHistory?: boolean;
  historyLimit?: number;
  eyeDropper?: boolean;
  trigger?: 'click' | 'hover';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
  showAlpha?: boolean;
  disableAlpha?: boolean;
}

// Tags input types
export interface TagsInputProps extends BaseFormField {
  suggestions?: string[];
  allowNew?: boolean;
  maxTags?: number;
  minTags?: number;
  separators?: string[];
  pasteSplit?: (data: string) => string[];
  renderTag?: (tag: string, index: number) => React.ReactNode;
  renderInput?: (props: any) => React.ReactNode;
  renderSuggestion?: (suggestion: string, query: string) => React.ReactNode;
  shouldRenderSuggestions?: (query: string) => boolean;
  onTagAdd?: (tag: string) => void;
  onTagDelete?: (index: number) => void;
  onInputChange?: (value: string) => void;
  onInputBlur?: () => void;
  onInputFocus?: () => void;
  validate?: (tag: string) => boolean;
  transform?: (tag: string) => string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  suggestionsFilter?: (suggestions: string[], query: string) => string[];
  placeholder?: string;
  clearAll?: boolean;
  addOnBlur?: boolean;
  addOnPaste?: boolean;
  editable?: boolean;
  expandable?: boolean;
  inline?: boolean;
}

// Form structure types
export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  collapsed?: boolean;
  conditional?: ConditionalConfig;
  validation?: ValidationConfig;
  className?: string;
  style?: React.CSSProperties;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  sections: string[];
  validation?: ValidationConfig;
  beforeNext?: (formData: any) => boolean | Promise<boolean>;
  beforePrevious?: (formData: any) => boolean | Promise<boolean>;
  onEnter?: (formData: any) => void;
  onLeave?: (formData: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface FormLayout {
  type: 'vertical' | 'horizontal' | 'grid' | 'inline';
  columns?: number;
  spacing?: number;
  responsive?: boolean;
  breakpoints?: Record<string, number>;
  labelPosition?: 'top' | 'left' | 'right' | 'bottom';
  labelWidth?: string | number;
  fieldWidth?: string | number;
  colon?: boolean;
  requiredMark?: boolean | 'optional';
  validateTrigger?: 'onChange' | 'onBlur' | 'onSubmit' | string[];
  preserve?: boolean;
  scrollToError?: boolean;
}

// Form state and validation
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  valid: boolean;
  submitting: boolean;
  submitted: boolean;
}

export interface FormProps extends BaseComponent {
  fields: Record<string, BaseFormField>;
  sections?: FormSection[];
  steps?: FormStep[];
  layout?: FormLayout;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>, formState: FormState) => void | Promise<void>;
  onReset?: (formState: FormState) => void;
  onChange?: (values: Record<string, any>, formState: FormState) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  isMultiStep?: boolean;
  showProgress?: boolean;
  autoSave?: boolean;
}

// Form hooks and utilities
export interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  validateField: (field: string) => Promise<string | undefined>;
  validateForm: () => Promise<Record<string, string>>;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  handleSubmit: (onSubmit?: (values: Record<string, any>) => void) => (e?: React.FormEvent) => void;
  handleChange: (field: string) => (value: any) => void;
  handleBlur: (field: string) => () => void;
}

export interface FormFieldConfig extends BaseFormField {
  type: FormFieldType;
  props?: Record<string, any>;
  grid?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  order?: number;
  section?: string;
  step?: string;
}

export interface FormBuilderProps {
  schema: Record<string, FormFieldConfig>;
  sections?: FormSection[];
  steps?: FormStep[];
  layout?: FormLayout;
  onSubmit: (values: Record<string, any>) => void;
  editable?: boolean;
  preview?: boolean;
}

// Form context types
export interface FormContextValue {
  formState: FormState;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  validateField: (field: string) => Promise<string | undefined>;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  layout: FormLayout;
}

export interface FormProviderProps {
  children: React.ReactNode;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  layout?: FormLayout;
}
