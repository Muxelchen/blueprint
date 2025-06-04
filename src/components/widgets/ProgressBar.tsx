import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  value?: number;
  max?: number;
  title?: string;
  variant?: 'default' | 'gradient' | 'striped' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showPercentage?: boolean;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 65,
  max = 100,
  title = 'Progress',
  variant = 'default',
  size = 'md',
  color = 'blue',
  showPercentage = true,
  animate = true
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animate]);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    red: 'bg-gradient-to-r from-red-400 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600'
  };

  const getProgressBarClass = () => {
    const baseClass = `${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`;
    
    if (variant === 'gradient') {
      return `${baseClass} ${gradientClasses[color]}`;
    }
    
    if (variant === 'striped' || variant === 'animated') {
      return `${baseClass} ${colorClasses[color]} bg-stripes`;
    }
    
    return `${baseClass} ${colorClasses[color]}`;
  };

  // Mock data for multiple progress bars
  const mockProgressData = [
    { label: 'CPU Usage', value: 73, color: 'blue' as const },
    { label: 'Memory', value: 45, color: 'green' as const },
    { label: 'Storage', value: 89, color: 'red' as const },
    { label: 'Network', value: 32, color: 'yellow' as const },
    { label: 'GPU', value: 67, color: 'purple' as const }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      
      {/* Main Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Main Progress</span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</span>
          )}
        </div>
        <div 
          className="w-full bg-gray-200 rounded-full relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={getProgressBarClass()}
            style={{ width: `${percentage}%` }}
          >
            {variant === 'animated' && (
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            )}
            {variant === 'striped' && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)'
                }}
              ></div>
            )}
            {isHovered && (
              <div className="absolute inset-0 bg-white opacity-20"></div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Multiple Progress Bars */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">System Metrics</h4>
        {mockProgressData.map((item, index) => {
          const itemPercentage = (item.value / 100) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${colorClasses[item.color]}`}
                  style={{ 
                    width: `${animate ? itemPercentage : 0}%`
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular Progress */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-800 mb-4">Circular Progress</h4>
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={`rgb(59 130 246)`} // blue-500
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - animatedValue / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Controls */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Progress Variants</h5>
        <div className="space-y-3">
          {['default', 'gradient', 'striped', 'animated'].map((variantType, index) => (
            <div key={variantType} className="space-y-1">
              <span className="text-xs text-gray-600 capitalize">{variantType}</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    variantType === 'gradient' ? gradientClasses.blue :
                    variantType === 'striped' ? `${colorClasses.blue} bg-stripes` :
                    variantType === 'animated' ? `${colorClasses.blue} animate-pulse` :
                    colorClasses.blue
                  }`}
                  style={{ width: `${(50 + index * 10)}%` }}
                >
                  {variantType === 'striped' && (
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)'
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{percentage.toFixed(1)}%</div>
          <div className="text-xs text-blue-600">Current</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-900">{max}</div>
          <div className="text-xs text-green-600">Target</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-orange-900">{(max - value).toFixed(0)}</div>
          <div className="text-xs text-orange-600">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;