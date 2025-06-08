import React, { useState } from 'react';

export type SkeletonVariant = 'default' | 'pulse' | 'wave' | 'shimmer';
export type SkeletonShape = 'rectangle' | 'circle' | 'rounded';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  shape?: SkeletonShape;
  className?: string;
  animate?: boolean;
}

export interface SkeletonScreenProps {
  type?: 'card' | 'list' | 'profile' | 'article' | 'dashboard' | 'table' | 'grid' | 'chat';
  count?: number;
  variant?: SkeletonVariant;
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
  animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'default',
  shape = 'rectangle',
  className = '',
  animate = true,
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: 'bg-gray-200',
      pulse: 'bg-gray-200 animate-pulse',
      wave: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite]',
      shimmer:
        'bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]',
    };
    return animate ? variants[variant] : variants.default;
  };

  const getShapeClasses = () => {
    const shapes = {
      rectangle: '',
      circle: 'rounded-full',
      rounded: 'rounded-md',
    };
    return shapes[shape];
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={`${getVariantClasses()} ${getShapeClasses()} ${className}`} style={style} />
  );
};

const SkeletonScreen: React.FC<SkeletonScreenProps> = ({
  type = 'card',
  count = 1,
  variant = 'pulse',
  showAvatar = true,
  showImage = true,
  lines = 3,
  className = '',
  animated = true,
}) => {
  const renderCardSkeleton = () => (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
      {/* Header with avatar */}
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <Skeleton width={40} height={40} shape="circle" variant={variant} animate={animated} />
          <div className="space-y-2 flex-1">
            <Skeleton width="60%" height={16} variant={variant} animate={animated} />
            <Skeleton width="40%" height={12} variant={variant} animate={animated} />
          </div>
        </div>
      )}

      {/* Image */}
      {showImage && (
        <Skeleton width="100%" height={200} shape="rounded" variant={variant} animate={animated} />
      )}

      {/* Content lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === lines - 1 ? '75%' : '100%'}
            height={14}
            variant={variant}
            animate={animated}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex space-x-4">
          <Skeleton width={60} height={32} shape="rounded" variant={variant} animate={animated} />
          <Skeleton width={60} height={32} shape="rounded" variant={variant} animate={animated} />
        </div>
        <Skeleton width={80} height={32} shape="rounded" variant={variant} animate={animated} />
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="border-b border-gray-200 py-4 space-y-3">
      <div className="flex items-start space-x-3">
        {showAvatar && (
          <Skeleton width={48} height={48} shape="circle" variant={variant} animate={animated} />
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton width="40%" height={16} variant={variant} animate={animated} />
            <Skeleton width="20%" height={12} variant={variant} animate={animated} />
          </div>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              width={i === lines - 1 ? '60%' : '100%'}
              height={14}
              variant={variant}
              animate={animated}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Cover */}
      <Skeleton width="100%" height={200} variant={variant} animate={animated} />

      <div className="p-6 space-y-4">
        {/* Avatar */}
        <div className="flex items-start space-x-4 -mt-16">
          <Skeleton
            width={120}
            height={120}
            shape="circle"
            variant={variant}
            animate={animated}
            className="border-4 border-white"
          />
          <div className="flex-1 pt-16 space-y-2">
            <Skeleton width="60%" height={24} variant={variant} animate={animated} />
            <Skeleton width="40%" height={16} variant={variant} animate={animated} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton width="100%" height={20} variant={variant} animate={animated} />
              <Skeleton
                width="60%"
                height={14}
                variant={variant}
                animate={animated}
                className="mx-auto"
              />
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="space-y-2 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              width={i === 3 ? '70%' : '100%'}
              height={14}
              variant={variant}
              animate={animated}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderArticleSkeleton = () => (
    <article className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
      {/* Title */}
      <div className="space-y-3">
        <Skeleton width="90%" height={32} variant={variant} animate={animated} />
        <Skeleton width="60%" height={32} variant={variant} animate={animated} />
      </div>

      {/* Meta */}
      <div className="flex items-center space-x-4">
        <Skeleton width={32} height={32} shape="circle" variant={variant} animate={animated} />
        <div className="space-y-1">
          <Skeleton width={120} height={14} variant={variant} animate={animated} />
          <Skeleton width={80} height={12} variant={variant} animate={animated} />
        </div>
      </div>

      {/* Featured image */}
      {showImage && (
        <Skeleton width="100%" height={300} shape="rounded" variant={variant} animate={animated} />
      )}

      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            width={Math.random() > 0.3 ? '100%' : `${Math.floor(Math.random() * 30 + 60)}%`}
            height={16}
            variant={variant}
            animate={animated}
          />
        ))}
      </div>
    </article>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="80%" height={16} variant={variant} animate={animated} />
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: count }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 p-4 last:border-b-0">
          <div className="grid grid-cols-5 gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Skeleton
                width={24}
                height={24}
                shape="circle"
                variant={variant}
                animate={animated}
              />
              <Skeleton width="60%" height={14} variant={variant} animate={animated} />
            </div>
            <Skeleton width="80%" height={14} variant={variant} animate={animated} />
            <Skeleton width={60} height={20} shape="rounded" variant={variant} animate={animated} />
            <Skeleton width="70%" height={14} variant={variant} animate={animated} />
            <div className="flex space-x-2">
              <Skeleton
                width={24}
                height={24}
                shape="rounded"
                variant={variant}
                animate={animated}
              />
              <Skeleton
                width={24}
                height={24}
                shape="rounded"
                variant={variant}
                animate={animated}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width={200} height={28} variant={variant} animate={animated} />
          <Skeleton width={300} height={16} variant={variant} animate={animated} />
        </div>
        <Skeleton width={120} height={40} shape="rounded" variant={variant} animate={animated} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton
                width={40}
                height={40}
                shape="rounded"
                variant={variant}
                animate={animated}
              />
              <Skeleton width={60} height={16} variant={variant} animate={animated} />
            </div>
            <div className="space-y-2">
              <Skeleton width="100%" height={24} variant={variant} animate={animated} />
              <Skeleton width="60%" height={14} variant={variant} animate={animated} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <Skeleton width="50%" height={20} variant={variant} animate={animated} />
          <Skeleton
            width="100%"
            height={250}
            shape="rounded"
            variant={variant}
            animate={animated}
          />
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <Skeleton width="50%" height={20} variant={variant} animate={animated} />
          <Skeleton
            width="100%"
            height={250}
            shape="rounded"
            variant={variant}
            animate={animated}
          />
        </div>
      </div>
    </div>
  );

  const renderGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {showImage && <Skeleton width="100%" height={200} variant={variant} animate={animated} />}
          <div className="p-4 space-y-3">
            <Skeleton width="80%" height={18} variant={variant} animate={animated} />
            <div className="space-y-2">
              {Array.from({ length: lines }).map((_, j) => (
                <Skeleton
                  key={j}
                  width={j === lines - 1 ? '60%' : '100%'}
                  height={14}
                  variant={variant}
                  animate={animated}
                />
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton width={80} height={16} variant={variant} animate={animated} />
              <Skeleton
                width={60}
                height={32}
                shape="rounded"
                variant={variant}
                animate={animated}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChatSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div
            className={`flex items-start space-x-2 max-w-xs ${i % 2 === 0 ? '' : 'flex-row-reverse space-x-reverse'}`}
          >
            <Skeleton width={32} height={32} shape="circle" variant={variant} animate={animated} />
            <div
              className={`space-y-2 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-blue-100'} p-3 rounded-lg`}
            >
              <Skeleton width="100%" height={14} variant={variant} animate={animated} />
              {Math.random() > 0.5 && (
                <Skeleton width="70%" height={14} variant={variant} animate={animated} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return renderCardSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'article':
        return renderArticleSkeleton();
      case 'dashboard':
        return renderDashboardSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'grid':
        return renderGridSkeleton();
      case 'chat':
        return renderChatSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  if (
    type === 'grid' ||
    type === 'chat' ||
    type === 'dashboard' ||
    type === 'profile' ||
    type === 'article' ||
    type === 'table'
  ) {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

// Skeleton Hook for loading states
export const useSkeleton = () => {
  const [loading, setLoading] = useState(false);

  const showSkeleton = (duration?: number) => {
    setLoading(true);
    if (duration) {
      setTimeout(() => setLoading(false), duration);
    }
  };

  const hideSkeleton = () => setLoading(false);

  return { loading, showSkeleton, hideSkeleton };
};

// Example usage component
export const ExampleSkeletonScreens: React.FC = () => {
  const [activeType, setActiveType] = useState<SkeletonScreenProps['type']>('card');
  const [variant, setVariant] = useState<SkeletonVariant>('pulse');
  const [animated, setAnimated] = useState(true);

  const skeletonTypes: Array<{
    type: SkeletonScreenProps['type'];
    label: string;
    description: string;
  }> = [
    { type: 'card', label: 'Card', description: 'Social media or blog post card' },
    { type: 'list', label: 'List', description: 'List item with avatar and content' },
    { type: 'profile', label: 'Profile', description: 'User profile with cover and stats' },
    { type: 'article', label: 'Article', description: 'Blog article or news post' },
    { type: 'dashboard', label: 'Dashboard', description: 'Analytics dashboard layout' },
    { type: 'table', label: 'Table', description: 'Data table with rows and columns' },
    { type: 'grid', label: 'Grid', description: 'Product or content grid' },
    { type: 'chat', label: 'Chat', description: 'Chat messages layout' },
  ];

  const variants: Array<{ variant: SkeletonVariant; label: string }> = [
    { variant: 'default', label: 'Default' },
    { variant: 'pulse', label: 'Pulse' },
    { variant: 'wave', label: 'Wave' },
    { variant: 'shimmer', label: 'Shimmer' },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Skeleton Screen Types</h3>

        {/* Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
            {skeletonTypes.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-sm font-medium text-gray-700 mr-2">Animation:</label>
            {variants.map(({ variant: v, label }) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  variant === v
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            ))}

            <label className="flex items-center ml-4">
              <input
                type="checkbox"
                checked={animated}
                onChange={e => setAnimated(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Animated</span>
            </label>
          </div>
        </div>

        {/* Current selection info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">
            {skeletonTypes.find(t => t.type === activeType)?.label} Skeleton
          </h4>
          <p className="text-sm text-blue-700">
            {skeletonTypes.find(t => t.type === activeType)?.description}
          </p>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <SkeletonScreen
            type={activeType}
            variant={variant}
            animated={animated}
            count={
              activeType === 'grid' ? 6 : activeType === 'chat' ? 5 : activeType === 'table' ? 5 : 3
            }
          />
        </div>
      </div>

      {/* Individual skeleton elements */}
      <div>
        <h4 className="font-medium mb-4">Individual Skeleton Elements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h5 className="text-sm font-medium text-gray-700">Basic Shapes</h5>
            <Skeleton width="100%" height={20} variant={variant} animate={animated} />
            <Skeleton width={80} height={80} shape="circle" variant={variant} animate={animated} />
            <Skeleton
              width="100%"
              height={100}
              shape="rounded"
              variant={variant}
              animate={animated}
            />
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h5 className="text-sm font-medium text-gray-700">Text Lines</h5>
            <Skeleton width="100%" height={16} variant={variant} animate={animated} />
            <Skeleton width="80%" height={16} variant={variant} animate={animated} />
            <Skeleton width="60%" height={16} variant={variant} animate={animated} />
            <Skeleton width="90%" height={16} variant={variant} animate={animated} />
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h5 className="text-sm font-medium text-gray-700">UI Elements</h5>
            <div className="flex items-center space-x-2">
              <Skeleton
                width={32}
                height={32}
                shape="circle"
                variant={variant}
                animate={animated}
              />
              <Skeleton width="60%" height={16} variant={variant} animate={animated} />
            </div>
            <Skeleton
              width="100%"
              height={40}
              shape="rounded"
              variant={variant}
              animate={animated}
            />
            <div className="flex space-x-2">
              <Skeleton
                width={60}
                height={32}
                shape="rounded"
                variant={variant}
                animate={animated}
              />
              <Skeleton
                width={60}
                height={32}
                shape="rounded"
                variant={variant}
                animate={animated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Skeleton };
export default SkeletonScreen;
