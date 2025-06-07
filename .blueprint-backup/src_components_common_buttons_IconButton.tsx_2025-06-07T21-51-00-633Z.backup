import React, { useState } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  isLoading?: boolean;
  rounded?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  tooltip,
  tooltipPosition = 'top',
  isLoading = false,
  rounded = true,
  disabled,
  className = '',
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative hover:transform hover:scale-110 active:scale-95';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary:
      'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    success:
      'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    warning:
      'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    outline:
      'bg-transparent border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
  };

  const sizes = {
    xs: 'w-6 h-6 p-1',
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
    xl: 'w-14 h-14 p-3',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const tooltipPositions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
    bottom:
      'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800',
    right:
      'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800',
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    rounded ? 'rounded-lg' : 'rounded-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (tooltip) setShowTooltip(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowTooltip(false);
    onMouseLeave?.(e);
  };

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isLoading ? (
        <div className={`${iconSizes[size]} animate-spin`}>
          <div className="w-full h-full border-2 border-current border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <span className={iconSizes[size]}>{icon}</span>
      )}

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className={`absolute z-50 ${tooltipPositions[tooltipPosition]}`}>
          <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
            {tooltip}
            <div className={`absolute w-0 h-0 ${arrowPositions[tooltipPosition]}`}></div>
          </div>
        </div>
      )}
    </button>
  );
};

export default IconButton;
