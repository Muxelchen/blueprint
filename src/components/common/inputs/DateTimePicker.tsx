import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface DateTimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  format?: 'date' | 'time' | 'datetime';
  showTimeSelect?: boolean;
  showSeconds?: boolean;
  use24Hour?: boolean;
  minDate?: Date;
  maxDate?: Date;
  excludeDates?: Date[];
  includeDates?: Date[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'success' | 'warning';
  label?: string;
  description?: string;
  error?: string;
  clearable?: boolean;
  closeOnSelect?: boolean;
  highlightToday?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onChange?: (date: Date | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  inputClassName?: string;
  calendarClassName?: string;
  name?: string;
  id?: string;
}

export interface DateTimePickerState {
  isOpen: boolean;
  selectedDate: Date | null;
  viewDate: Date;
  currentView: 'date' | 'month' | 'year' | 'time';
  inputValue: string;
  isFocused: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value: controlledValue,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  format = 'date',
  showTimeSelect = false,
  showSeconds = false,
  use24Hour = false,
  minDate,
  maxDate,
  excludeDates = [],
  includeDates = [],
  size = 'md',
  variant = 'default',
  label,
  description,
  error,
  clearable = true,
  closeOnSelect = true,
  highlightToday = true,
  weekStartsOn = 0,
  onChange,
  onFocus,
  onBlur,
  className = '',
  inputClassName = '',
  calendarClassName = '',
  name,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;

  const [state, setState] = useState<DateTimePickerState>({
    isOpen: false,
    selectedDate: controlledValue || defaultValue || null,
    viewDate: controlledValue || defaultValue || new Date(),
    currentView: format === 'time' ? 'time' : 'date',
    inputValue: formatDate(controlledValue || defaultValue || null, format, use24Hour, showSeconds),
    isFocused: false,
  });

  // Format date to string
  function formatDate(date: Date | null, fmt: string, use24Hr: boolean, showSecs: boolean): string {
    if (!date) return '';

    const pad = (num: number) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    let ampm = '';
    if (!use24Hr) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    const hourStr = pad(hours);
    const timeStr = showSecs
      ? `${hourStr}:${minutes}:${seconds}${ampm}`
      : `${hourStr}:${minutes}${ampm}`;

    switch (fmt) {
      case 'date':
        return `${month}/${day}/${year}`;
      case 'time':
        return timeStr;
      case 'datetime':
        return `${month}/${day}/${year} ${timeStr}`;
      default:
        return `${month}/${day}/${year}`;
    }
  }

  // Parse string to date
  function parseDate(dateStr: string, fmt: string): Date | null {
    if (!dateStr.trim()) return null;

    try {
      if (fmt === 'time') {
        const today = new Date();
        const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
        if (!timeMatch) return null;

        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
        const ampm = timeMatch[4];

        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hours !== 12) hours += 12;
          if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }

        today.setHours(hours, minutes, seconds, 0);
        return today;
      }

      // For date and datetime formats
      const parts = dateStr.split(' ');
      const datePart = parts[0];
      const timePart = parts[1];

      const dateMatch = datePart.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (!dateMatch) return null;

      const month = parseInt(dateMatch[1]) - 1;
      const day = parseInt(dateMatch[2]);
      const year = parseInt(dateMatch[3]);

      const date = new Date(year, month, day);

      if (timePart && fmt === 'datetime') {
        const timeMatch = timePart.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
          const ampm = timeMatch[4];

          if (ampm) {
            if (ampm.toUpperCase() === 'PM' && hours !== 12) hours += 12;
            if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
          }

          date.setHours(hours, minutes, seconds, 0);
        }
      }

      return date;
    } catch {
      return null;
    }
  }

  // Update state when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== state.selectedDate) {
      setState(prev => ({
        ...prev,
        selectedDate: controlledValue,
        viewDate: controlledValue || new Date(),
        inputValue: formatDate(controlledValue, format, use24Hour, showSeconds),
      }));
    }
  }, [controlledValue, isControlled, format, use24Hour, showSeconds]);

  const handleToggle = useCallback(() => {
    if (disabled) return;

    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));

    if (!state.isOpen) {
      onFocus?.();
    } else {
      onBlur?.();
    }
  }, [disabled, state.isOpen, onFocus, onBlur]);

  const handleDateSelect = useCallback(
    (date: Date) => {
      // Preserve time if we're in datetime mode and already have a time
      let newDate = new Date(date);

      if (format === 'datetime' && state.selectedDate) {
        newDate.setHours(
          state.selectedDate.getHours(),
          state.selectedDate.getMinutes(),
          state.selectedDate.getSeconds(),
          state.selectedDate.getMilliseconds()
        );
      }

      if (!isControlled) {
        setState(prev => ({
          ...prev,
          selectedDate: newDate,
          inputValue: formatDate(newDate, format, use24Hour, showSeconds),
          isOpen: closeOnSelect && format === 'date' ? false : prev.isOpen,
        }));
      }

      onChange?.(newDate);
    },
    [state.selectedDate, format, isControlled, onChange, closeOnSelect, use24Hour, showSeconds]
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number, seconds?: number) => {
      const newDate = state.selectedDate ? new Date(state.selectedDate) : new Date();
      newDate.setHours(hours, minutes, seconds || 0, 0);

      if (!isControlled) {
        setState(prev => ({
          ...prev,
          selectedDate: newDate,
          inputValue: formatDate(newDate, format, use24Hour, showSeconds),
        }));
      }

      onChange?.(newDate);
    },
    [state.selectedDate, format, isControlled, onChange, use24Hour, showSeconds]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setState(prev => ({ ...prev, inputValue: value }));

      const parsedDate = parseDate(value, format);
      if (parsedDate && isValidDate(parsedDate)) {
        if (!isControlled) {
          setState(prev => ({ ...prev, selectedDate: parsedDate, viewDate: parsedDate }));
        }
        onChange?.(parsedDate);
      }
    },
    [format, isControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isControlled) {
        setState(prev => ({
          ...prev,
          selectedDate: null,
          inputValue: '',
        }));
      }

      onChange?.(null);
    },
    [isControlled, onChange]
  );

  const isValidDate = useCallback(
    (date: Date): boolean => {
      if (!date || isNaN(date.getTime())) return false;

      if (minDate && date < minDate) return false;
      if (maxDate && date > maxDate) return false;

      if (
        excludeDates.some(
          excludeDate =>
            date.getFullYear() === excludeDate.getFullYear() &&
            date.getMonth() === excludeDate.getMonth() &&
            date.getDate() === excludeDate.getDate()
        )
      )
        return false;

      if (
        includeDates.length > 0 &&
        !includeDates.some(
          includeDate =>
            date.getFullYear() === includeDate.getFullYear() &&
            date.getMonth() === includeDate.getMonth() &&
            date.getDate() === includeDate.getDate()
        )
      )
        return false;

      return true;
    },
    [minDate, maxDate, excludeDates, includeDates]
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false }));
        onBlur?.();
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.isOpen, onBlur]);

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        input: 'px-3 py-1.5 text-sm',
        icon: 'w-4 h-4',
        calendar: 'text-sm',
      },
      md: {
        input: 'px-3 py-2 text-base',
        icon: 'w-5 h-5',
        calendar: 'text-base',
      },
      lg: {
        input: 'px-4 py-3 text-lg',
        icon: 'w-6 h-6',
        calendar: 'text-lg',
      },
    };
    return configs[size];
  };

  // Variant configurations
  const getVariantConfig = () => {
    const configs = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
      warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
    };
    return configs[variant];
  };

  const sizeConfig = getSizeConfig();
  const variantConfig = getVariantConfig();
  const inputId = id || name || `datetime-picker-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = `
    w-full border rounded-md bg-white transition-colors duration-200
    ${sizeConfig.input}
    ${variantConfig}
    ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400'}
    ${inputClassName}
  `;

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
      {description && !error && (
        <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      )}

      {/* Input Container */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id={inputId}
            name={name}
            value={state.inputValue}
            placeholder={placeholder || getPlaceholder()}
            disabled={disabled}
            required={required}
            onChange={handleInputChange}
            onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
            onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
            className={inputClasses}
          />

          {/* Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {/* Clear Button */}
            {clearable && state.selectedDate && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Calendar/Clock Icon */}
            <button
              type="button"
              onClick={handleToggle}
              disabled={disabled}
              className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
              tabIndex={-1}
            >
              {format === 'time' ? (
                <Clock className={sizeConfig.icon} />
              ) : (
                <Calendar className={sizeConfig.icon} />
              )}
            </button>
          </div>
        </div>

        {/* Calendar/Time Picker */}
        {state.isOpen && (
          <div
            className={`
            absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg
            ${sizeConfig.calendar}
            ${calendarClassName}
          `}
          >
            {format !== 'time' && <CalendarView />}
            {(format === 'time' || (format === 'datetime' && showTimeSelect)) && <TimeView />}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );

  function getPlaceholder(): string {
    switch (format) {
      case 'date':
        return 'MM/DD/YYYY';
      case 'time':
        return use24Hour ? 'HH:MM' : 'HH:MM AM/PM';
      case 'datetime':
        return use24Hour ? 'MM/DD/YYYY HH:MM' : 'MM/DD/YYYY HH:MM AM/PM';
      default:
        return 'Select date';
    }
  }

  function CalendarView() {
    const today = new Date();
    const currentMonth = state.viewDate.getMonth();
    const currentYear = state.viewDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = (firstDayOfMonth.getDay() - weekStartsOn + 7) % 7;

    const daysInMonth = lastDayOfMonth.getDate();
    const daysFromPrevMonth = firstDayOfWeek;
    const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;

    const cells = [];

    // Previous month days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      cells.push({ date, isCurrentMonth: false, isPrevMonth: true });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      cells.push({ date, isCurrentMonth: true, isPrevMonth: false });
    }

    // Next month days
    const remainingCells = totalCells - cells.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      cells.push({ date, isCurrentMonth: false, isPrevMonth: false });
    }

    const navigateMonth = (direction: number) => {
      setState(prev => ({
        ...prev,
        viewDate: new Date(prev.viewDate.getFullYear(), prev.viewDate.getMonth() + direction, 1),
      }));
    };

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const adjustedWeekDays = [...weekDays.slice(weekStartsOn), ...weekDays.slice(0, weekStartsOn)];

    return (
      <div className="p-4 w-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </div>

          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {adjustedWeekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ date, isCurrentMonth }, index) => {
            const isSelected =
              state.selectedDate &&
              date.getFullYear() === state.selectedDate.getFullYear() &&
              date.getMonth() === state.selectedDate.getMonth() &&
              date.getDate() === state.selectedDate.getDate();

            const isToday =
              highlightToday &&
              date.getFullYear() === today.getFullYear() &&
              date.getMonth() === today.getMonth() &&
              date.getDate() === today.getDate();

            const isDisabled = !isValidDate(date);

            return (
              <button
                key={index}
                type="button"
                onClick={() => !isDisabled && handleDateSelect(date)}
                disabled={isDisabled}
                className={`
                  w-8 h-8 text-sm rounded hover:bg-blue-100 transition-colors
                  ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                  ${isDisabled ? 'text-gray-300 cursor-not-allowed hover:bg-transparent' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Time selector for datetime */}
        {format === 'datetime' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, currentView: 'time' }))}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Select Time
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function TimeView() {
    const currentTime = state.selectedDate || new Date();
    const hours24 = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const hours12 = use24Hour ? hours24 : hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    const handleHourChange = (hour: number) => {
      let actualHour = hour;
      if (!use24Hour) {
        if (ampm === 'PM' && hour !== 12) actualHour = hour + 12;
        if (ampm === 'AM' && hour === 12) actualHour = 0;
      }
      handleTimeChange(actualHour, minutes, showSeconds ? seconds : undefined);
    };

    const handleMinuteChange = (minute: number) => {
      handleTimeChange(hours24, minute, showSeconds ? seconds : undefined);
    };

    const handleSecondChange = (second: number) => {
      handleTimeChange(hours24, minutes, second);
    };

    const handleAmPmChange = (period: 'AM' | 'PM') => {
      const newHour =
        period === 'PM' ? (hours12 === 12 ? 12 : hours12 + 12) : hours12 === 12 ? 0 : hours12;
      handleTimeChange(newHour, minutes, showSeconds ? seconds : undefined);
    };

    return (
      <div className="p-4 w-64">
        {format === 'datetime' && (
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setState(prev => ({ ...prev, currentView: 'date' }))}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Date
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* Time Display */}
          <div className="text-center">
            <div className="text-2xl font-mono">
              {String(use24Hour ? hours24 : hours12).padStart(2, '0')}:
              {String(minutes).padStart(2, '0')}
              {showSeconds && `:${String(seconds).padStart(2, '0')}`}
              {!use24Hour && ` ${ampm}`}
            </div>
          </div>

          {/* Hour Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hour</label>
            <select
              value={use24Hour ? hours24 : hours12}
              onChange={e => handleHourChange(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {Array.from({ length: use24Hour ? 24 : 12 }, (_, i) => {
                const value = use24Hour ? i : i + 1;
                return (
                  <option key={value} value={value}>
                    {String(value).padStart(2, '0')}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Minute Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Minute</label>
            <select
              value={minutes}
              onChange={e => handleMinuteChange(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          {/* Second Selector */}
          {showSeconds && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Second</label>
              <select
                value={seconds}
                onChange={e => handleSecondChange(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* AM/PM Selector */}
          {!use24Hour && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Period</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAmPmChange('AM')}
                  className={`
                    px-3 py-1 text-sm rounded border transition-colors
                    ${
                      ampm === 'AM'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleAmPmChange('PM')}
                  className={`
                    px-3 py-1 text-sm rounded border transition-colors
                    ${
                      ampm === 'PM'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  PM
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

// Hook for managing date/time state
export const useDateTimePicker = (initialDate?: Date) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);

  const selectDate = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const selectToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const clear = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const isSelected = useCallback(
    (date: Date) => {
      return selectedDate
        ? date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate()
        : false;
    },
    [selectedDate]
  );

  return {
    selectedDate,
    setSelectedDate,
    selectDate,
    selectToday,
    clear,
    isSelected,
  };
};

// Example usage component
export const ExampleDateTimePickers: React.FC = () => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [timeValue, setTimeValue] = useState<Date | null>(new Date());
  const [datetimeValue, setDatetimeValue] = useState<Date | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Date/Time Picker Examples</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Picker */}
          <div>
            <h4 className="font-medium mb-4">Date Picker</h4>
            <DateTimePicker
              label="Select Date"
              description="Choose a date from the calendar"
              format="date"
              value={dateValue}
              onChange={setDateValue}
              placeholder="Choose date..."
              clearable
              highlightToday
            />
          </div>

          {/* Time Picker */}
          <div>
            <h4 className="font-medium mb-4">Time Picker</h4>
            <DateTimePicker
              label="Select Time"
              description="Choose a time"
              format="time"
              value={timeValue}
              onChange={setTimeValue}
              placeholder="Choose time..."
              showSeconds
              use24Hour={false}
            />
          </div>

          {/* DateTime Picker */}
          <div>
            <h4 className="font-medium mb-4">DateTime Picker</h4>
            <DateTimePicker
              label="Select Date & Time"
              description="Choose both date and time"
              format="datetime"
              value={datetimeValue}
              onChange={setDatetimeValue}
              placeholder="Choose date and time..."
              showTimeSelect
              use24Hour
            />
          </div>

          {/* Constrained Date Picker */}
          <div>
            <h4 className="font-medium mb-4">Constrained Date</h4>
            <DateTimePicker
              label="Future Dates Only"
              description="Only dates from tomorrow onwards"
              format="date"
              minDate={tomorrow}
              maxDate={nextWeek}
              placeholder="Choose future date..."
              variant="success"
            />
          </div>

          {/* Size Variants */}
          <div>
            <h4 className="font-medium mb-4">Size Variants</h4>
            <div className="space-y-4">
              <DateTimePicker label="Small" format="date" size="sm" placeholder="Small picker..." />

              <DateTimePicker
                label="Medium"
                format="date"
                size="md"
                placeholder="Medium picker..."
              />

              <DateTimePicker label="Large" format="date" size="lg" placeholder="Large picker..." />
            </div>
          </div>

          {/* States */}
          <div>
            <h4 className="font-medium mb-4">Different States</h4>
            <div className="space-y-4">
              <DateTimePicker
                label="Error State"
                format="date"
                variant="error"
                error="This field is required"
                placeholder="Error state..."
              />

              <DateTimePicker
                label="Disabled State"
                format="date"
                disabled
                placeholder="Disabled picker..."
                value={new Date()}
              />

              <DateTimePicker
                label="Required Field"
                format="date"
                required
                placeholder="Required field..."
                variant="warning"
              />
            </div>
          </div>
        </div>

        {/* Current State Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current Selections</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Date:</strong> {dateValue ? dateValue.toLocaleDateString() : 'None'}
            </p>
            <p>
              <strong>Time:</strong> {timeValue ? timeValue.toLocaleTimeString() : 'None'}
            </p>
            <p>
              <strong>DateTime:</strong> {datetimeValue ? datetimeValue.toLocaleString() : 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
