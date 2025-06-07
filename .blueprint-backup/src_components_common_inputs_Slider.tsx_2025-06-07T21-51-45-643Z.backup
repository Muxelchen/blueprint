import React, { useState, useCallback, useEffect, useRef } from 'react';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  showValue?: boolean;
  showTicks?: boolean;
  showMinMax?: boolean;
  marks?: { value: number; label?: string }[];
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  onChangeStart?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
  sliderClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

export interface SliderState {
  currentValue: number;
  isDragging: boolean;
  isFocused: boolean;
  isHovered: boolean;
}

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  label,
  description,
  showValue = true,
  showTicks = false,
  showMinMax = false,
  marks = [],
  formatValue = value => value.toString(),
  onChange,
  onChangeStart,
  onChangeEnd,
  className = '',
  sliderClassName = '',
  trackClassName = '',
  thumbClassName = '',
  name,
  id,
  required = false,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;

  const [state, setState] = useState<SliderState>({
    currentValue: controlledValue ?? defaultValue,
    isDragging: false,
    isFocused: false,
    isHovered: false,
  });

  // Update state when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== state.currentValue) {
      setState(prev => ({ ...prev, currentValue: controlledValue }));
    }
  }, [controlledValue, isControlled]);

  // Clamp value to valid range
  const clampValue = useCallback(
    (value: number) => {
      const clampedValue = Math.max(min, Math.min(max, value));
      return Math.round(clampedValue / step) * step;
    },
    [min, max, step]
  );

  // Convert pixel position to value
  const positionToValue = useCallback(
    (clientX: number, clientY: number) => {
      if (!sliderRef.current) return state.currentValue;

      const rect = sliderRef.current.getBoundingClientRect();
      const isHorizontal = orientation === 'horizontal';

      const position = isHorizontal
        ? (clientX - rect.left) / rect.width
        : 1 - (clientY - rect.top) / rect.height;

      const rawValue = min + position * (max - min);
      return clampValue(rawValue);
    },
    [min, max, orientation, clampValue, state.currentValue]
  );

  // Update value
  const updateValue = useCallback(
    (newValue: number, triggerChange = true) => {
      const clampedValue = clampValue(newValue);

      if (!isControlled) {
        setState(prev => ({ ...prev, currentValue: clampedValue }));
      }

      if (triggerChange) {
        onChange?.(clampedValue);
      }
    },
    [clampValue, isControlled, onChange]
  );

  // Handle mouse events
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;

      event.preventDefault();
      const newValue = positionToValue(event.clientX, event.clientY);

      setState(prev => ({ ...prev, isDragging: true }));
      updateValue(newValue);
      onChangeStart?.(newValue);

      const handleMouseMove = (e: MouseEvent) => {
        const value = positionToValue(e.clientX, e.clientY);
        updateValue(value);
      };

      const handleMouseUp = () => {
        setState(prev => ({ ...prev, isDragging: false }));
        onChangeEnd?.(state.currentValue);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, positionToValue, updateValue, onChangeStart, onChangeEnd, state.currentValue]
  );

  // Handle touch events
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (disabled) return;

      const touch = event.touches[0];
      const newValue = positionToValue(touch.clientX, touch.clientY);

      setState(prev => ({ ...prev, isDragging: true }));
      updateValue(newValue);
      onChangeStart?.(newValue);

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const value = positionToValue(touch.clientX, touch.clientY);
        updateValue(value);
      };

      const handleTouchEnd = () => {
        setState(prev => ({ ...prev, isDragging: false }));
        onChangeEnd?.(state.currentValue);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    },
    [disabled, positionToValue, updateValue, onChangeStart, onChangeEnd, state.currentValue]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = state.currentValue;
      const largeStep = step * 10;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          newValue = state.currentValue - step;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          newValue = state.currentValue + step;
          break;
        case 'PageDown':
          event.preventDefault();
          newValue = state.currentValue - largeStep;
          break;
        case 'PageUp':
          event.preventDefault();
          newValue = state.currentValue + largeStep;
          break;
        case 'Home':
          event.preventDefault();
          newValue = min;
          break;
        case 'End':
          event.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      updateValue(newValue);
    },
    [disabled, state.currentValue, step, min, max, updateValue]
  );

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false }));
  }, []);

  // Calculate percentage for positioning
  const getPercentage = () => {
    return ((state.currentValue - min) / (max - min)) * 100;
  };

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        track: orientation === 'horizontal' ? 'h-1' : 'w-1',
        thumb: 'w-4 h-4',
        container: orientation === 'horizontal' ? 'h-6' : 'w-6',
      },
      md: {
        track: orientation === 'horizontal' ? 'h-2' : 'w-2',
        thumb: 'w-5 h-5',
        container: orientation === 'horizontal' ? 'h-8' : 'w-8',
      },
      lg: {
        track: orientation === 'horizontal' ? 'h-3' : 'w-3',
        thumb: 'w-6 h-6',
        container: orientation === 'horizontal' ? 'h-10' : 'w-10',
      },
    };
    return configs[size];
  };

  // Variant configurations
  const getVariantConfig = () => {
    const configs = {
      default: {
        track: 'bg-gray-200',
        fill: 'bg-gray-600',
        thumb: 'bg-white border-gray-600',
        focus: 'focus:ring-gray-500',
      },
      primary: {
        track: 'bg-gray-200',
        fill: 'bg-blue-600',
        thumb: 'bg-white border-blue-600',
        focus: 'focus:ring-blue-500',
      },
      success: {
        track: 'bg-gray-200',
        fill: 'bg-green-600',
        thumb: 'bg-white border-green-600',
        focus: 'focus:ring-green-500',
      },
      warning: {
        track: 'bg-gray-200',
        fill: 'bg-yellow-500',
        thumb: 'bg-white border-yellow-500',
        focus: 'focus:ring-yellow-500',
      },
      danger: {
        track: 'bg-gray-200',
        fill: 'bg-red-600',
        thumb: 'bg-white border-red-600',
        focus: 'focus:ring-red-500',
      },
    };
    return configs[variant];
  };

  const sizeConfig = getSizeConfig();
  const variantConfig = getVariantConfig();
  const sliderId = id || name || `slider-${Math.random().toString(36).substr(2, 9)}`;
  const percentage = getPercentage();

  // Generate tick marks
  const generateTicks = () => {
    if (!showTicks && marks.length === 0) return [];

    const ticks = [];

    if (showTicks) {
      const tickCount = Math.min(21, (max - min) / step + 1); // Limit ticks
      const tickStep = (max - min) / (tickCount - 1);

      for (let i = 0; i < tickCount; i++) {
        const value = min + i * tickStep;
        ticks.push({ value: clampValue(value), label: '' });
      }
    }

    // Add custom marks
    marks.forEach(mark => {
      if (mark.value >= min && mark.value <= max) {
        ticks.push(mark);
      }
    });

    return ticks.sort((a, b) => a.value - b.value);
  };

  const ticks = generateTicks();

  const containerClasses = `
    relative flex items-center
    ${orientation === 'horizontal' ? 'w-full' : 'h-48 flex-col justify-center'}
    ${sizeConfig.container}
    ${className}
  `;

  const trackClasses = `
    relative rounded-full cursor-pointer
    ${orientation === 'horizontal' ? 'w-full' : 'h-full'}
    ${sizeConfig.track}
    ${variantConfig.track}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${trackClassName}
  `;

  const fillClasses = `
    absolute rounded-full pointer-events-none
    ${
      orientation === 'horizontal'
        ? `h-full ${sizeConfig.track}`
        : `w-full ${sizeConfig.track} bottom-0`
    }
    ${variantConfig.fill}
    ${disabled ? 'opacity-50' : ''}
  `;

  const thumbClasses = `
    absolute rounded-full border-2 shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2
    transition-all duration-150 ease-in-out
    ${sizeConfig.thumb}
    ${variantConfig.thumb}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
    ${state.isFocused ? `ring-2 ring-offset-2 ${variantConfig.focus}` : ''}
    ${state.isDragging ? 'scale-110' : ''}
    ${thumbClassName}
  `;

  return (
    <div className={`space-y-2 ${sliderClassName}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={sliderId}
            className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {showValue && (
            <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {formatValue(state.currentValue)}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      )}

      {/* Min/Max Labels */}
      {showMinMax && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}

      {/* Slider Container */}
      <div className={containerClasses}>
        {/* Hidden input for form submission */}
        <input
          type="range"
          id={sliderId}
          name={name}
          min={min}
          max={max}
          step={step}
          value={state.currentValue}
          disabled={disabled}
          required={required}
          onChange={() => {}} // Handled by mouse/touch events
          className="sr-only"
        />

        {/* Track */}
        <div
          ref={sliderRef}
          className={trackClasses}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Fill */}
          <div
            className={fillClasses}
            style={{
              [orientation === 'horizontal' ? 'width' : 'height']: `${percentage}%`,
            }}
          />

          {/* Ticks */}
          {ticks.map((tick, index) => {
            const tickPercentage = ((tick.value - min) / (max - min)) * 100;
            return (
              <div
                key={index}
                className={`absolute w-0.5 h-0.5 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                  orientation === 'horizontal' ? 'top-1/2' : 'left-1/2'
                }`}
                style={{
                  [orientation === 'horizontal' ? 'left' : 'bottom']: `${tickPercentage}%`,
                }}
              />
            );
          })}

          {/* Thumb */}
          <div
            ref={thumbRef}
            className={thumbClasses}
            style={{
              [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
              [orientation === 'horizontal' ? 'top' : 'left']: '50%',
            }}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            role="slider"
            aria-valuenow={state.currentValue}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label || 'Slider'}
          />
        </div>

        {/* Mark Labels */}
        {marks.length > 0 && (
          <div
            className={`absolute ${orientation === 'horizontal' ? 'top-full mt-2 w-full' : 'left-full ml-2 h-full'}`}
          >
            {marks.map((mark, index) => {
              if (!mark.label) return null;
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={index}
                  className={`absolute text-xs text-gray-500 ${
                    orientation === 'horizontal'
                      ? 'transform -translate-x-1/2'
                      : 'transform -translate-y-1/2'
                  }`}
                  style={{
                    [orientation === 'horizontal' ? 'left' : 'bottom']: `${markPercentage}%`,
                  }}
                >
                  {mark.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Range Slider Component (dual handles)
export interface RangeSliderProps extends Omit<SliderProps, 'value' | 'defaultValue' | 'onChange'> {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  minDistance?: number;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value: controlledValue,
  defaultValue = [0, 100],
  onChange,
  minDistance = 0,
  ...props
}) => {
  const isControlled = controlledValue !== undefined;
  const [range, setRange] = useState<[number, number]>(controlledValue || defaultValue);

  useEffect(() => {
    if (isControlled && controlledValue) {
      setRange(controlledValue);
    }
  }, [controlledValue, isControlled]);

  const handleLowChange = useCallback(
    (value: number) => {
      const newRange: [number, number] = [Math.min(value, range[1] - minDistance), range[1]];

      if (!isControlled) {
        setRange(newRange);
      }
      onChange?.(newRange);
    },
    [range, minDistance, isControlled, onChange]
  );

  const handleHighChange = useCallback(
    (value: number) => {
      const newRange: [number, number] = [range[0], Math.max(value, range[0] + minDistance)];

      if (!isControlled) {
        setRange(newRange);
      }
      onChange?.(newRange);
    },
    [range, minDistance, isControlled, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
          <Slider
            {...props}
            value={range[0]}
            onChange={handleLowChange}
            max={props.max || 100}
            showValue
            label={undefined}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
          <Slider
            {...props}
            value={range[1]}
            onChange={handleHighChange}
            max={props.max || 100}
            showValue
            label={undefined}
          />
        </div>
      </div>
      <div className="text-sm text-gray-600 text-center">
        Range: {range[0]} - {range[1]}
      </div>
    </div>
  );
};

// Example usage component
export const ExampleSliders: React.FC = () => {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);
  const [temperature, setTemperature] = useState(22);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 80]);
  const [settings, setSettings] = useState({
    quality: 80,
    speed: 2,
    opacity: 0.8,
  });

  const temperatureMarks = [
    { value: 0, label: 'Cold' },
    { value: 25, label: 'Room' },
    { value: 50, label: 'Warm' },
    { value: 75, label: 'Hot' },
    { value: 100, label: 'Very Hot' },
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Slider Examples</h3>

        <div className="space-y-8">
          {/* Basic Sliders */}
          <div>
            <h4 className="font-medium mb-4">Basic Sliders</h4>
            <div className="space-y-6">
              <Slider
                label="Volume"
                description="Adjust the audio volume"
                value={volume}
                onChange={setVolume}
                min={0}
                max={100}
                step={1}
                variant="primary"
                showMinMax
              />

              <Slider
                label="Brightness"
                description="Screen brightness level"
                value={brightness}
                onChange={setBrightness}
                min={0}
                max={100}
                step={5}
                variant="success"
                formatValue={value => `${value}%`}
              />

              <Slider
                label="Temperature"
                description="Room temperature setting"
                value={temperature}
                onChange={setTemperature}
                min={0}
                max={100}
                step={1}
                variant="warning"
                marks={temperatureMarks}
                formatValue={value => `${value}°C`}
              />
            </div>
          </div>

          {/* Size Variants */}
          <div>
            <h4 className="font-medium mb-4">Size Variants</h4>
            <div className="space-y-6">
              <Slider label="Small Slider" defaultValue={30} size="sm" variant="primary" />

              <Slider label="Medium Slider" defaultValue={60} size="md" variant="primary" />

              <Slider label="Large Slider" defaultValue={90} size="lg" variant="primary" />
            </div>
          </div>

          {/* Color Variants */}
          <div>
            <h4 className="font-medium mb-4">Color Variants</h4>
            <div className="space-y-4">
              <Slider label="Default" defaultValue={50} variant="default" />
              <Slider label="Primary" defaultValue={50} variant="primary" />
              <Slider label="Success" defaultValue={50} variant="success" />
              <Slider label="Warning" defaultValue={50} variant="warning" />
              <Slider label="Danger" defaultValue={50} variant="danger" />
            </div>
          </div>

          {/* Range Slider */}
          <div>
            <h4 className="font-medium mb-4">Range Slider</h4>
            <RangeSlider
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={100}
              minDistance={10}
              variant="primary"
              formatValue={value => `$${value}`}
            />
          </div>

          {/* Vertical Slider */}
          <div>
            <h4 className="font-medium mb-4">Vertical Slider</h4>
            <div className="flex justify-center">
              <Slider
                label="Vertical Control"
                value={settings.opacity * 100}
                onChange={value => setSettings(prev => ({ ...prev, opacity: value / 100 }))}
                min={0}
                max={100}
                orientation="vertical"
                variant="primary"
                formatValue={value => `${value}%`}
              />
            </div>
          </div>

          {/* With Ticks */}
          <div>
            <h4 className="font-medium mb-4">Slider with Ticks</h4>
            <Slider
              label="Quality Setting"
              value={settings.quality}
              onChange={value => setSettings(prev => ({ ...prev, quality: value }))}
              min={0}
              max={100}
              step={10}
              showTicks
              variant="success"
              formatValue={value => `${value}%`}
            />
          </div>

          {/* Disabled State */}
          <div>
            <h4 className="font-medium mb-4">Disabled State</h4>
            <Slider label="Disabled Slider" defaultValue={75} disabled variant="primary" />
          </div>
        </div>

        {/* Current State Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current Values</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Volume:</strong> {volume}
              </p>
              <p>
                <strong>Brightness:</strong> {brightness}%
              </p>
              <p>
                <strong>Temperature:</strong> {temperature}°C
              </p>
              <p>
                <strong>Price Range:</strong> ${priceRange[0]} - ${priceRange[1]}
              </p>
            </div>
            <div>
              <p>
                <strong>Settings:</strong>
              </p>
              <pre className="text-xs bg-white p-2 rounded border mt-1">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
