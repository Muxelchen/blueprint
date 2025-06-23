import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Eye,
  EyeOff,
  RotateCw,
  Move,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';

interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  caption?: string;
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
    size?: string;
    format?: string;
    author?: string;
    date?: string;
  };
}

interface ImageWidgetProps {
  // Image data - single image or gallery
  image?: ImageData;
  images?: ImageData[];
  
  // Display options
  mode?: 'single' | 'gallery' | 'slideshow';
  size?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  
  // Features
  enableZoom?: boolean;
  enableLightbox?: boolean;
  enableDownload?: boolean;
  enableShare?: boolean;
  enableRotation?: boolean;
  enableDragPan?: boolean;
  lazyLoading?: boolean;
  
  // Gallery options
  showThumbnails?: boolean;
  thumbnailPosition?: 'bottom' | 'right' | 'left';
  enableAutoplay?: boolean;
  autoplayInterval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  
  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  
  // Callbacks
  onImageClick?: (image: ImageData, index: number) => void;
  onDownload?: (image: ImageData) => void;
  onShare?: (image: ImageData) => void;
  onError?: (error: string, image: ImageData) => void;
}

// Mock data for demonstration
const mockImages: ImageData[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    alt: 'Mountain landscape',
    title: 'Majestic Mountains',
    description: 'Beautiful mountain landscape with sunset',
    caption: 'Captured during golden hour',
    tags: ['nature', 'mountains', 'sunset'],
    metadata: {
      width: 1920,
      height: 1080,
      size: '2.1 MB',
      format: 'JPEG',
      author: 'Nature Photographer',
      date: '2024-01-15',
    },
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    alt: 'Forest lake',
    title: 'Serene Lake',
    description: 'Peaceful lake surrounded by forest',
    caption: 'Early morning reflection',
    tags: ['nature', 'lake', 'forest'],
    metadata: {
      width: 1920,
      height: 1280,
      size: '1.8 MB',
      format: 'JPEG',
      author: 'Landscape Pro',
      date: '2024-01-12',
    },
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800',
    alt: 'Ocean waves',
    title: 'Ocean Waves',
    description: 'Powerful waves crashing on rocks',
    caption: 'High tide at sunset',
    tags: ['ocean', 'waves', 'rocks'],
    metadata: {
      width: 1920,
      height: 1080,
      size: '2.5 MB',
      format: 'JPEG',
      author: 'Ocean Explorer',
      date: '2024-01-10',
    },
  },
];

const ImageWidget: React.FC<ImageWidgetProps> = ({
  image,
  images = mockImages,
  mode = 'single',
  size = 'medium',
  aspectRatio = 'auto',
  objectFit = 'cover',
  enableZoom = true,
  enableLightbox = true,
  enableDownload = false,
  enableShare = false,
  enableRotation = false,
  enableDragPan = false,
  lazyLoading = true,
  showThumbnails = true,
  thumbnailPosition = 'bottom',
  enableAutoplay = false,
  autoplayInterval = 3000,
  showNavigation = true,
  showIndicators = true,
  borderRadius = 'medium',
  shadow = 'small',
  border = false,
  onImageClick,
  onDownload,
  onShare,
  onError,
}) => {
  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current image(s)
  const currentImages = mode === 'single' && image ? [image] : images;
  const currentImage = currentImages[currentImageIndex];

  // Size configurations
  const sizeConfig = {
    small: { width: '200px', height: '150px' },
    medium: { width: '400px', height: '300px' },
    large: { width: '600px', height: '450px' },
    full: { width: '100%', height: '400px' },
  };

  // Aspect ratio configurations
  const aspectRatioConfig = {
    square: 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]',
    auto: '',
  };

  // Border radius configurations
  const borderRadiusConfig = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  };

  // Shadow configurations
  const shadowConfig = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };

  // Handle image loading
  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
    setIsLoading(false);
  }, []);

  // Handle image error
  const handleImageError = useCallback((imageId: string) => {
    setImageErrors(prev => new Set([...prev, imageId]));
    setIsLoading(false);
    if (onError && currentImage) {
      onError('Failed to load image', currentImage);
    }
  }, [onError, currentImage]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % currentImages.length);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [currentImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + currentImages.length) % currentImages.length);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [currentImages.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Transform functions
  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
    // Reset position if zoomed out too much
    setPosition(prev => {
      if (zoom <= 1) return { x: 0, y: 0 };
      return prev;
    });
  }, [zoom]);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Fixed drag pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDragPan || zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  }, [enableDragPan, zoom, position.x, position.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !enableDragPan || zoom <= 1) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Constrain movement based on zoom level
    const maxMove = 100 * (zoom - 1);
    const constrainedX = Math.max(-maxMove, Math.min(maxMove, newX));
    const constrainedY = Math.max(-maxMove, Math.min(maxMove, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, enableDragPan, zoom, dragStart.x, dragStart.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Lightbox functions
  const openLightbox = useCallback(() => {
    if (enableLightbox) {
      setIsLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
    if (onImageClick && currentImage) {
      onImageClick(currentImage, currentImageIndex);
    }
  }, [enableLightbox, onImageClick, currentImage, currentImageIndex]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
    resetTransform();
  }, [resetTransform]);

  // Download and share functions
  const handleDownload = useCallback(async () => {
    if (!currentImage || !enableDownload) return;
    
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentImage.title || currentImage.alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      if (onDownload) {
        onDownload(currentImage);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [currentImage, enableDownload, onDownload]);

  const handleShare = useCallback(async () => {
    if (!currentImage || !enableShare) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title,
          text: currentImage.description,
          url: currentImage.src,
        });
        
        if (onShare) {
          onShare(currentImage);
        }
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentImage.src);
        // Could show a toast notification here
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
      }
    }
  }, [currentImage, enableShare, onShare]);

  // Autoplay effect
  useEffect(() => {
    if (!enableAutoplay || currentImages.length <= 1) return;
    
    const interval = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(interval);
  }, [enableAutoplay, autoplayInterval, goToNext, currentImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          if (currentImages.length > 1) goToPrevious();
          break;
        case 'ArrowRight':
          if (currentImages.length > 1) goToNext();
          break;
        case '+':
        case '=':
          if (enableZoom) handleZoomIn();
          break;
        case '-':
          if (enableZoom) handleZoomOut();
          break;
        case 'r':
        case 'R':
          if (enableRotation) handleRotate();
          break;
        case '0':
          resetTransform();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext, handleZoomIn, handleZoomOut, handleRotate, resetTransform, enableRotation, enableZoom, currentImages.length]);

  // Mouse event listeners for drag pan
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !enableDragPan || zoom <= 1) return;
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain movement based on zoom level
      const maxMove = 100 * (zoom - 1);
      const constrainedX = Math.max(-maxMove, Math.min(maxMove, newX));
      const constrainedY = Math.max(-maxMove, Math.min(maxMove, newY));
      
      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, enableDragPan, zoom, dragStart.x, dragStart.y]);

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No image provided</p>
        </div>
      </div>
    );
  }

  const containerClasses = `
    relative overflow-hidden
    ${aspectRatioConfig[aspectRatio]}
    ${borderRadiusConfig[borderRadius]}
    ${shadowConfig[shadow]}
    ${border ? 'border border-gray-200' : ''}
    ${enableLightbox ? 'cursor-pointer' : ''}
    group
  `.trim();

  const imageClasses = `
    w-full h-full transition-all duration-300
    ${objectFit === 'cover' ? 'object-cover' : ''}
    ${objectFit === 'contain' ? 'object-contain' : ''}
    ${objectFit === 'fill' ? 'object-fill' : ''}
    ${objectFit === 'scale-down' ? 'object-scale-down' : ''}
    ${enableDragPan && zoom > 1 ? 'cursor-move' : ''}
    ${isDragging ? 'select-none' : ''}
  `.trim();

  return (
    <div className="w-full">
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className={containerClasses}
        style={size !== 'full' ? sizeConfig[size] : undefined}
        onClick={openLightbox}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {imageErrors.has(currentImage.id) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Failed to load image</p>
            </div>
          </div>
        )}

        {/* Main Image */}
        <img
          ref={imageRef}
          src={currentImage.src}
          alt={currentImage.alt}
          className={imageClasses}
          loading={lazyLoading ? 'lazy' : 'eager'}
          onLoad={() => handleImageLoad(currentImage.id)}
          onError={() => handleImageError(currentImage.id)}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center',
          }}
          onMouseDown={handleMouseDown}
          draggable={false}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {enableZoom && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                  className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                  className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </>
            )}
            {enableRotation && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRotate(); }}
                className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-all"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
            {enableLightbox && (
              <button
                onClick={(e) => { e.stopPropagation(); openLightbox(); }}
                className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-all"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Gallery Navigation */}
          {mode !== 'single' && currentImages.length > 1 && showNavigation && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Info */}
          {currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm">{currentImage.caption}</p>
            </div>
          )}
        </div>

        {/* Image Counter */}
        {mode !== 'single' && currentImages.length > 1 && showIndicators && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1} / {currentImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {mode !== 'single' && showThumbnails && currentImages.length > 1 && (
        <div className={`
          flex gap-2 mt-3
          ${thumbnailPosition === 'bottom' ? 'flex-row overflow-x-auto' : 'flex-col overflow-y-auto max-h-64'}
        `}>
          {currentImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => goToImage(index)}
              className={`
                flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all
                ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'}
              `}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {(enableDownload || enableShare) && (
        <div className="flex gap-2 mt-3">
          {enableDownload && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
          {enableShare && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {currentImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            {enableRotation && (
              <button
                onClick={handleRotate}
                className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all"
                title="Rotate (R)"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={resetTransform}
              className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all"
              title="Reset (0)"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Main Lightbox Image */}
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className={`max-w-full max-h-full object-contain transition-all duration-300 ${enableDragPan && zoom > 1 ? 'cursor-move' : ''}`}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center',
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          </div>

          {/* Image Info Panel */}
          {(currentImage.title || currentImage.description) && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-4 rounded max-w-lg">
              {currentImage.title && (
                <h3 className="text-lg font-semibold mb-1">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="text-sm opacity-90">{currentImage.description}</p>
              )}
              {currentImages.length > 1 && (
                <p className="text-xs opacity-75 mt-2">
                  {currentImageIndex + 1} of {currentImages.length}
                </p>
              )}
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <div className="absolute bottom-4 right-4 text-white text-xs opacity-60">
            <div>ESC: Close • ←→: Navigate • +/-: Zoom</div>
            {enableRotation && <div>R: Rotate • 0: Reset</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWidget;