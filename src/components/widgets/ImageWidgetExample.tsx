import React, { useState } from 'react';
import ImageWidget from './ImageWidget';

const ImageWidgetExample: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'single' | 'gallery' | 'slideshow'>('single');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large' | 'full'>('medium');

  // Example single image
  const singleImage = {
    id: 'example-single',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    alt: 'Mountain landscape',
    title: 'Majestic Mountains',
    description: 'Beautiful mountain landscape with sunset colors',
    caption: 'Captured during golden hour in the Alps',
    tags: ['nature', 'mountains', 'sunset'],
    metadata: {
      width: 1920,
      height: 1080,
      size: '2.1 MB',
      format: 'JPEG',
      author: 'Nature Photographer',
      date: '2024-01-15',
    },
  };

  // Example gallery images
  const galleryImages = [
    {
      id: 'gallery-1',
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
      title: 'Majestic Mountains',
      description: 'Beautiful mountain landscape with sunset',
      caption: 'Captured during golden hour',
      tags: ['nature', 'mountains', 'sunset'],
    },
    {
      id: 'gallery-2',
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      alt: 'Forest lake',
      title: 'Serene Lake',
      description: 'Peaceful lake surrounded by forest',
      caption: 'Early morning reflection',
      tags: ['nature', 'lake', 'forest'],
    },
    {
      id: 'gallery-3',
      src: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800',
      alt: 'Ocean waves',
      title: 'Ocean Waves',
      description: 'Powerful waves crashing on rocks',
      caption: 'High tide at sunset',
      tags: ['ocean', 'waves', 'rocks'],
    },
    {
      id: 'gallery-4',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      alt: 'Forest path',
      title: 'Mystic Forest',
      description: 'Enchanting forest path in morning mist',
      caption: 'Walking through the fairy tale',
      tags: ['forest', 'path', 'mist'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ImageWidget Showcase</h1>
        <p className="text-gray-600">Comprehensive image display component with zoom, lightbox, and gallery features</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Widget Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
            <select 
              value={selectedMode} 
              onChange={(e) => setSelectedMode(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="single">Single Image</option>
              <option value="gallery">Gallery</option>
              <option value="slideshow">Slideshow</option>
            </select>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget Size</label>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small (200x150)</option>
              <option value="medium">Medium (400x300)</option>
              <option value="large">Large (600x450)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>
      </div>

      {/* Widget Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Basic Single Image */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Basic Image Widget</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <ImageWidget
              mode={selectedMode}
              size={selectedSize}
              image={selectedMode === 'single' ? singleImage : undefined}
              images={selectedMode !== 'single' ? galleryImages : undefined}
              enableZoom={true}
              enableLightbox={true}
              lazyLoading={true}
              borderRadius="medium"
              shadow="small"
              border={true}
            />
          </div>
        </div>

        {/* Feature-Rich Widget */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Feature-Rich Widget</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <ImageWidget
              mode={selectedMode}
              size={selectedSize}
              image={selectedMode === 'single' ? singleImage : undefined}
              images={selectedMode !== 'single' ? galleryImages : undefined}
              enableZoom={true}
              enableLightbox={true}
              enableDownload={true}
              enableShare={true}
              enableRotation={true}
              enableDragPan={true}
              lazyLoading={true}
              showThumbnails={true}
              showNavigation={true}
              showIndicators={true}
              enableAutoplay={selectedMode === 'slideshow'}
              autoplayInterval={3000}
              borderRadius="large"
              shadow="medium"
              border={true}
              aspectRatio="16:9"
              objectFit="cover"
              onImageClick={(image, index) => {
                console.log('Image clicked:', image.title, 'at index:', index);
              }}
              onDownload={(image) => {
                console.log('Download requested for:', image.title);
              }}
              onShare={(image) => {
                console.log('Share requested for:', image.title);
              }}
              onError={(error, image) => {
                console.error('Image error:', error, 'for:', image.title);
              }}
            />
          </div>
        </div>
      </div>

      {/* Aspect Ratio Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Different Aspect Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['square', '16:9', '4:3', '3:2'] as const).map((ratio) => (
            <div key={ratio} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 text-center">{ratio}</h4>
              <ImageWidget
                image={singleImage}
                size="small"
                aspectRatio={ratio}
                enableZoom={true}
                enableLightbox={true}
                borderRadius="medium"
                shadow="small"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Object Fit Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Object Fit Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['cover', 'contain', 'fill', 'scale-down'] as const).map((fit) => (
            <div key={fit} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 text-center">{fit}</h4>
              <ImageWidget
                image={singleImage}
                size="small"
                aspectRatio="square"
                objectFit={fit}
                enableZoom={true}
                enableLightbox={true}
                borderRadius="medium"
                shadow="small"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Usage Instructions</h3>
        <div className="text-blue-800 space-y-2">
          <p><strong>Lightbox:</strong> Click on any image to open in fullscreen lightbox mode</p>
          <p><strong>Gallery Navigation:</strong> Use arrow buttons or keyboard arrows (←/→) to navigate</p>
          <p><strong>Zoom:</strong> Use zoom buttons or keyboard shortcuts (+/-) to zoom in/out</p>
          <p><strong>Rotation:</strong> Press 'R' key in lightbox mode to rotate images</p>
          <p><strong>Reset:</strong> Press '0' key to reset zoom and rotation</p>
          <p><strong>Close:</strong> Press 'ESC' key or click X button to close lightbox</p>
          <p><strong>Drag:</strong> When zoomed in, drag the image to pan around</p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-3">ImageWidget Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-green-800">
            <h4 className="font-medium">Display Modes</h4>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Single image display</li>
              <li>• Gallery with thumbnails</li>
              <li>• Slideshow with autoplay</li>
            </ul>
          </div>
          
          <div className="text-green-800">
            <h4 className="font-medium">Interactive Features</h4>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Zoom in/out functionality</li>
              <li>• Drag to pan when zoomed</li>
              <li>• Image rotation</li>
              <li>• Lightbox modal view</li>
            </ul>
          </div>
          
          <div className="text-green-800">
            <h4 className="font-medium">Performance</h4>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Lazy loading support</li>
              <li>• Error handling</li>
              <li>• Loading states</li>
              <li>• Keyboard navigation</li>
            </ul>
          </div>
          
          <div className="text-green-800">
            <h4 className="font-medium">Customization</h4>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Multiple size options</li>
              <li>• Aspect ratio controls</li>
              <li>• Border radius styling</li>
              <li>• Shadow effects</li>
            </ul>
          </div>
          
          <div className="text-green-800">
            <h4 className="font-medium">Actions</h4>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Download images</li>
              <li>• Share functionality</li>
              <li>• Click callbacks</li>
              <li>• Error handling</li>
            </ul>
          </div>
          
          <div className="text-green-800">
            <h4 className="font-medium">Gallery Options</h4>
            <ul className="text-sm mt-1 space-y-1">
              <li>• Thumbnail navigation</li>
              <li>• Image indicators</li>
              <li>• Navigation arrows</li>
              <li>• Auto-play support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWidgetExample; 