import React, { useState, useCallback } from 'react';
import { Star, Heart, ThumbsUp } from 'lucide-react';

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'star' | 'heart' | 'thumb';
  color?: string;
  readOnly?: boolean;
  allowHalf?: boolean;
  allowClear?: boolean;
  showValue?: boolean;
  labels?: string[];
  onChange?: (value: number) => void;
  onHover?: (value: number | null) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  size = 'md',
  variant = 'star',
  color = '#fbbf24',
  readOnly = false,
  allowHalf = false,
  allowClear = true,
  showValue = false,
  labels = [],
  onChange,
  onHover,
  className = '',
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const currentValue = isControlled ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const getIcon = () => {
    switch (variant) {
      case 'heart':
        return Heart;
      case 'thumb':
        return ThumbsUp;
      default:
        return Star;
    }
  };

  const Icon = getIcon();

  const handleClick = useCallback((clickValue: number) => {
    if (readOnly) return;

    let newValue = clickValue;
    
    // Allow clearing when clicking the same value
    if (allowClear && clickValue === currentValue) {
      newValue = 0;
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [readOnly, allowClear, currentValue, isControlled, onChange]);

  const handleMouseEnter = useCallback((enterValue: number) => {
    if (readOnly) return;
    setHoverValue(enterValue);
    onHover?.(enterValue);
  }, [readOnly, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (readOnly) return;
    setHoverValue(null);
    onHover?.(null);
  }, [readOnly, onHover]);

  const getStarProps = (index: number) => {
    const starValue = index + 1;
    const halfValue = index + 0.5;
    
    let filled = false;
    let halfFilled = false;

    if (allowHalf) {
      if (displayValue >= starValue) {
        filled = true;
      } else if (displayValue >= halfValue) {
        halfFilled = true;
      }
    } else {
      filled = displayValue >= starValue;
    }

    return { filled, halfFilled, starValue, halfValue };
  };

  const renderStar = (index: number) => {
    const { filled, halfFilled, starValue, halfValue } = getStarProps(index);

    return (
      <div
        key={index}
        className="relative cursor-pointer"
        onMouseLeave={handleMouseLeave}
      >
        {/* Background star */}
        <Icon
          className={`
            ${sizeClasses[size]} 
            text-gray-300 dark:text-gray-600 
            transition-colors duration-200
          `}
        />
        
        {/* Filled star overlay */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: filled ? '100%' : halfFilled ? '50%' : '0%',
          }}
        >
          <Icon
            className={`${sizeClasses[size]} transition-colors duration-200`}
            style={{ color }}
            fill="currentColor"
          />
        </div>

        {/* Click areas */}
        {!readOnly && (
          <>
            {allowHalf && (
              <button
                className="absolute inset-0 w-1/2 h-full opacity-0"
                onClick={() => handleClick(halfValue)}
                onMouseEnter={() => handleMouseEnter(halfValue)}
                aria-label={`Rate ${halfValue} out of ${max}`}
              />
            )}
            <button
              className={`absolute inset-0 h-full opacity-0 ${allowHalf ? 'left-1/2 w-1/2' : 'w-full'}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              aria-label={`Rate ${starValue} out of ${max}`}
            />
          </>
        )}
      </div>
    );
  };

  const currentLabel = labels[Math.ceil(displayValue) - 1] || '';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`flex items-center gap-1 ${!readOnly ? 'cursor-pointer' : ''}`}
        role="radiogroup"
        aria-label={`Rating out of ${max}`}
      >
        {Array.from({ length: max }, (_, index) => renderStar(index))}
      </div>

      {showValue && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {displayValue.toFixed(allowHalf ? 1 : 0)}/{max}
        </span>
      )}

      {currentLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentLabel}
        </span>
      )}
    </div>
  );
};

export default Rating; 