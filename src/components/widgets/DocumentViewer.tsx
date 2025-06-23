import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid,
  Copy,
  File,
  FileType,
  Printer,
  AlertTriangle,
  Loader,
  X,
} from 'lucide-react';

interface DocumentData {
  id: string;
  url: string;
  filename: string;
  title?: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'rtf' | 'html';
  pages?: number;
  size?: string;
  lastModified?: Date;
  thumbnail?: string;
  metadata?: {
    author?: string;
    createdDate?: Date;
    keywords?: string[];
    description?: string;
    version?: string;
  };
}

interface DocumentViewerProps {
  document?: DocumentData;
  documents?: DocumentData[];
  mode?: 'single' | 'multiple';
  viewMode?: 'page' | 'continuous' | 'facing' | 'thumbnails';
  initialPage?: number;
  initialZoom?: number;
  
  // Features
  enableDownload?: boolean;
  enableShare?: boolean;
  enablePrint?: boolean;
  enableSearch?: boolean;
  enableThumbnails?: boolean;
  enableFullscreen?: boolean;
  enableRotation?: boolean;
  enableZoom?: boolean;
  
  // Navigation
  showPageNumbers?: boolean;
  showProgress?: boolean;
  enableKeyboardNav?: boolean;
  
  // UI Options
  showToolbar?: boolean;
  showSidebar?: boolean;
  sidebarPosition?: 'left' | 'right';
  theme?: 'light' | 'dark' | 'auto';
  
  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  height?: string;
  maxHeight?: string;
  
  // Callbacks
  onPageChange?: (page: number, document: DocumentData) => void;
  onZoomChange?: (zoom: number) => void;
  onViewModeChange?: (mode: string) => void;
  onDownload?: (document: DocumentData) => void;
  onPrint?: (document: DocumentData) => void;
}

// Mock data for demonstration
const mockDocuments: DocumentData[] = [
  {
    id: '1',
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    filename: 'sample-document.pdf',
    title: 'Sample PDF Document',
    type: 'pdf',
    pages: 12,
    size: '2.3 MB',
    lastModified: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    metadata: {
      author: 'John Doe',
      createdDate: new Date('2024-01-15'),
      keywords: ['sample', 'pdf', 'document'],
      description: 'A sample PDF document for testing purposes',
      version: '1.0',
    },
  },
  {
    id: '2',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy2.pdf',
    filename: 'user-manual.pdf',
    title: 'User Manual',
    type: 'pdf',
    pages: 45,
    size: '5.7 MB',
    lastModified: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200',
    metadata: {
      author: 'Technical Team',
      createdDate: new Date('2024-01-10'),
      keywords: ['manual', 'instructions', 'guide'],
      description: 'Complete user manual with step-by-step instructions',
      version: '2.1',
    },
  },
  {
    id: '3',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy3.pdf',
    filename: 'report-2024.pdf',
    title: 'Annual Report 2024',
    type: 'pdf',
    pages: 28,
    size: '8.1 MB',
    lastModified: new Date(),
    thumbnail: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=200',
    metadata: {
      author: 'Finance Department',
      createdDate: new Date('2024-01-01'),
      keywords: ['report', 'annual', 'financial'],
      description: 'Annual financial report with detailed analysis',
      version: '1.0',
    },
  },
];

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  documents = mockDocuments,
  mode = 'single',
  viewMode = 'page',
  initialPage = 1,
  initialZoom = 1,
  enableDownload = true,
  enableShare = true,
  enablePrint = true,
  enableSearch = true,
  enableThumbnails = true,
  enableFullscreen = true,
  enableRotation = true,
  enableZoom = true,
  showPageNumbers = true,
  showProgress = true,
  enableKeyboardNav = true,
  showToolbar = true,
  showSidebar = true,
  sidebarPosition = 'left',
  theme = 'light',
  borderRadius = 'medium',
  shadow = 'medium',
  border = true,
  height = '600px',
  maxHeight = '800px',
  onPageChange,
  onZoomChange,
  onViewModeChange,
  onDownload,
  onPrint,
}) => {
  // State management
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ page: number; snippet: string; position: { x: number; y: number } }>>([]);
  const [showThumbnailPanel, setShowThumbnailPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get current document(s)
  const currentDocuments = mode === 'single' && document ? [document] : documents;
  const currentDocument = currentDocuments[currentDocumentIndex];

  // Theme configurations
  const themeConfig = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      secondary: 'text-gray-600',
      border: 'border-gray-200',
      accent: 'bg-blue-500',
      hover: 'hover:bg-gray-100',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      secondary: 'text-gray-300',
      border: 'border-gray-700',
      accent: 'bg-blue-600',
      hover: 'hover:bg-gray-800',
    },
    auto: {
      bg: 'bg-white dark:bg-gray-900',
      text: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-700',
      accent: 'bg-blue-500 dark:bg-blue-600',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    },
  };

  const currentTheme = themeConfig[theme];

  // Border radius configurations
  const borderRadiusConfig = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  };

  // Shadow configurations
  const shadowConfig = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };

  // Document type icons
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="w-5 h-5 text-blue-500" />;
      case 'txt':
        return <FileType className="w-5 h-5 text-gray-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (!currentDocument || page < 1 || (currentDocument.pages && page > currentDocument.pages)) return;
    
    setCurrentPage(page);
    
    if (onPageChange) {
      onPageChange(page, currentDocument);
    }
  }, [currentDocument, onPageChange]);

  const goToNextPage = useCallback(() => {
    if (currentDocument?.pages && currentPage < currentDocument.pages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, currentDocument, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const goToNextDocument = useCallback(() => {
    if (currentDocumentIndex < currentDocuments.length - 1) {
      setCurrentDocumentIndex(currentDocumentIndex + 1);
      setCurrentPage(1);
    }
  }, [currentDocumentIndex, currentDocuments.length]);

  const goToPreviousDocument = useCallback(() => {
    if (currentDocumentIndex > 0) {
      setCurrentDocumentIndex(currentDocumentIndex - 1);
      setCurrentPage(1);
    }
  }, [currentDocumentIndex]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.25, 3);
    setZoom(newZoom);
    
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.25, 0.25);
    setZoom(newZoom);
    
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  // Rotation function
  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  // Fullscreen functions
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (globalThis.document.exitFullscreen) {
        globalThis.document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // View mode functions
  const handleViewModeChange = useCallback((newMode: string) => {
    if (onViewModeChange) {
      onViewModeChange(newMode);
    }
  }, [onViewModeChange]);

  // Search functions
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Mock search implementation
    const results = [
      { page: 1, snippet: `...example of ${searchQuery} in the document...`, position: { x: 100, y: 200 } },
      { page: 3, snippet: `Another occurrence of ${searchQuery} found here...`, position: { x: 150, y: 300 } },
    ];
    
    setSearchResults(results);
  }, [searchQuery]);

  // Download function
  const handleDownload = useCallback(() => {
    if (!currentDocument || !enableDownload) return;
    
    const link = globalThis.document.createElement('a');
    link.href = currentDocument.url;
    link.download = currentDocument.filename;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    
    if (onDownload) {
      onDownload(currentDocument);
    }
  }, [currentDocument, enableDownload, onDownload]);

  // Share function
  const handleShare = useCallback(async () => {
    if (!currentDocument || !enableShare) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentDocument.title || currentDocument.filename,
          text: `Check out this document: ${currentDocument.title || currentDocument.filename}`,
          url: currentDocument.url,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentDocument.url);
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
      }
    }
  }, [currentDocument, enableShare]);

  // Print function
  const handlePrint = useCallback(() => {
    if (!currentDocument || !enablePrint) return;
    
    window.print();
    
    if (onPrint) {
      onPrint(currentDocument);
    }
  }, [currentDocument, enablePrint, onPrint]);

  // Copy selected text
  const handleCopyText = useCallback(async () => {
    if (!selectedText) return;
    
    try {
      await navigator.clipboard.writeText(selectedText);
      setSelectedText('');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }, [selectedText]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(globalThis.document.activeElement)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (e.ctrlKey) {
            handleZoomIn();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (e.ctrlKey) {
            handleZoomOut();
          }
          break;
        case 'Home':
          e.preventDefault();
          goToPage(1);
          break;
        case 'End':
          e.preventDefault();
          if (currentDocument?.pages) {
            goToPage(currentDocument.pages);
          }
          break;
        case 'f':
        case 'F':
          if (e.ctrlKey) {
            e.preventDefault();
            setShowSearchPanel(!showSearchPanel);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }
          break;
        case 'Escape':
          setShowSearchPanel(false);
          setShowThumbnailPanel(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, goToPreviousPage, goToNextPage, handleZoomIn, handleZoomOut, goToPage, currentDocument, showSearchPanel]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!globalThis.document.fullscreenElement);
    };

    globalThis.document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => globalThis.document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Loading simulation
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate random error for demo
      if (Math.random() > 0.9) {
        setHasError(true);
        setErrorMessage('Failed to load document');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentDocument]);

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No document provided</p>
        </div>
      </div>
    );
  }

  const containerClasses = `
    ${currentTheme.bg}
    ${currentTheme.text}
    ${borderRadiusConfig[borderRadius]}
    ${shadowConfig[shadow]}
    ${border ? `border ${currentTheme.border}` : ''}
    overflow-hidden
    transition-all duration-300
    ${isFullscreen ? 'fixed inset-0 z-50' : ''}
  `.trim();

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={{ height: isFullscreen ? '100vh' : height, maxHeight: isFullscreen ? 'none' : maxHeight }}
      tabIndex={0}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className={`flex items-center justify-between px-4 py-2 border-b ${currentTheme.border} ${currentTheme.bg}`}>
          <div className="flex items-center space-x-2">
            {/* Document Info */}
            <div className="flex items-center space-x-2">
              {getDocumentIcon(currentDocument.type)}
              <div className="min-w-0">
                <h3 className="font-medium truncate text-sm">
                  {currentDocument.title || currentDocument.filename}
                </h3>
                <p className={`text-xs ${currentTheme.secondary} truncate`}>
                  {currentDocument.pages && `${currentDocument.pages} pages`}
                  {currentDocument.size && ` • ${currentDocument.size}`}
                </p>
              </div>
            </div>

            {/* Document Navigation */}
            {mode === 'multiple' && currentDocuments.length > 1 && (
              <div className="flex items-center space-x-1 ml-4">
                <button
                  onClick={goToPreviousDocument}
                  disabled={currentDocumentIndex === 0}
                  className={`p-1 ${currentTheme.hover} rounded disabled:opacity-50`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs px-2">
                  {currentDocumentIndex + 1} / {currentDocuments.length}
                </span>
                <button
                  onClick={goToNextDocument}
                  disabled={currentDocumentIndex === currentDocuments.length - 1}
                  className={`p-1 ${currentTheme.hover} rounded disabled:opacity-50`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* View Mode */}
            <div className="flex items-center space-x-1 mr-2">
              <button
                onClick={() => handleViewModeChange('page')}
                className={`p-1 ${currentTheme.hover} rounded ${viewMode === 'page' ? 'text-blue-500' : ''}`}
                title="Page View"
              >
                <File className="w-4 h-4" />
              </button>
              {enableThumbnails && (
                <button
                  onClick={() => setShowThumbnailPanel(!showThumbnailPanel)}
                  className={`p-1 ${currentTheme.hover} rounded ${showThumbnailPanel ? 'text-blue-500' : ''}`}
                  title="Thumbnails"
                >
                  <Grid className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search */}
            {enableSearch && (
              <button
                onClick={() => setShowSearchPanel(!showSearchPanel)}
                className={`p-1 ${currentTheme.hover} rounded ${showSearchPanel ? 'text-blue-500' : ''}`}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Zoom Controls */}
            {enableZoom && (
              <>
                <button
                  onClick={handleZoomOut}
                  className={`p-1 ${currentTheme.hover} rounded`}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs px-2 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className={`p-1 ${currentTheme.hover} rounded`}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Rotation */}
            {enableRotation && (
              <button
                onClick={handleRotate}
                className={`p-1 ${currentTheme.hover} rounded`}
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            {enableFullscreen && (
              <button
                onClick={toggleFullscreen}
                className={`p-1 ${currentTheme.hover} rounded`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2 border-l pl-2 border-gray-300">
              {enablePrint && (
                <button
                  onClick={handlePrint}
                  className={`p-1 ${currentTheme.hover} rounded`}
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}
              {enableDownload && (
                <button
                  onClick={handleDownload}
                  className={`p-1 ${currentTheme.hover} rounded`}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              {enableShare && (
                <button
                  onClick={handleShare}
                  className={`p-1 ${currentTheme.hover} rounded`}
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Panel */}
      {showSearchPanel && (
        <div className={`flex items-center space-x-2 px-4 py-2 border-b ${currentTheme.border} ${currentTheme.bg}`}>
          <Search className="w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search in document..."
            className={`flex-1 px-2 py-1 text-sm border rounded ${currentTheme.border} ${currentTheme.bg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={handleSearch}
            className={`px-3 py-1 text-sm ${currentTheme.accent} text-white rounded hover:opacity-80`}
          >
            Search
          </button>
          <button
            onClick={() => setShowSearchPanel(false)}
            className={`p-1 ${currentTheme.hover} rounded`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (showThumbnailPanel || searchResults.length > 0) && (
          <div className={`w-64 border-r ${currentTheme.border} ${currentTheme.bg} overflow-auto ${sidebarPosition === 'left' ? 'order-1' : 'order-3'}`}>
            {/* Thumbnails */}
            {showThumbnailPanel && enableThumbnails && currentDocument.pages && (
              <div className="p-4">
                <h3 className="font-medium mb-3 text-sm">Thumbnails</h3>
                <div className="space-y-2">
                  {Array.from({ length: currentDocument.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-full p-2 text-left rounded ${currentTheme.hover} ${
                        page === currentPage ? `${currentTheme.accent} text-white` : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                          {page}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium">Page {page}</div>
                          <div className={`text-xs ${currentTheme.secondary}`}>
                            Click to navigate
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium mb-3 text-sm">
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(result.page)}
                      className={`w-full p-2 text-left rounded ${currentTheme.hover}`}
                    >
                      <div className="text-sm font-medium">Page {result.page}</div>
                      <div className={`text-xs ${currentTheme.secondary} mt-1`}>
                        {result.snippet}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Viewer */}
        <div className={`flex-1 ${sidebarPosition === 'left' ? 'order-2' : 'order-1'} relative overflow-auto`}>
          <div
            ref={viewerRef}
            className="w-full h-full flex items-center justify-center p-4"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Document Preview */}
            <div 
              className="bg-white shadow-lg border max-w-full max-h-full"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              {currentDocument.type === 'pdf' ? (
                // PDF Viewer (would integrate with PDF.js or similar)
                <div className="w-96 h-[500px] flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-700 mb-2">PDF Document</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Page {currentPage} of {currentDocument.pages}
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF.js integration would render content here
                    </p>
                  </div>
                </div>
              ) : (
                // Other document types
                <div className="w-96 h-[500px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    {getDocumentIcon(currentDocument.type)}
                    <h3 className="font-medium text-gray-700 mt-4 mb-2">
                      {currentDocument.type.toUpperCase()} Document
                    </h3>
                    <p className="text-xs text-gray-400">
                      Document viewer would render content here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Navigation */}
          {showPageNumbers && currentDocument.pages && currentDocument.pages > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className={`flex items-center space-x-2 px-4 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg shadow-md`}>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-1 ${currentTheme.hover} rounded disabled:opacity-50`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= (currentDocument.pages || 1)) {
                        goToPage(page);
                      }
                    }}
                    className={`w-12 px-1 py-1 text-center text-sm border rounded ${currentTheme.border} ${currentTheme.bg}`}
                    min={1}
                    max={currentDocument.pages}
                  />
                  <span className={`text-sm ${currentTheme.secondary}`}>
                    of {currentDocument.pages}
                  </span>
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === currentDocument.pages}
                  className={`p-1 ${currentTheme.hover} rounded disabled:opacity-50`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && currentDocument.pages && currentDocument.pages > 1 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className={`h-full ${currentTheme.accent} transition-all duration-300`}
                style={{ width: `${(currentPage / currentDocument.pages) * 100}%` }}
              />
            </div>
          )}

          {/* Selected Text Actions */}
          {selectedText && (
            <div className="absolute top-4 right-4">
              <div className={`flex items-center space-x-2 px-3 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg shadow-md`}>
                <button
                  onClick={handleCopyText}
                  className={`flex items-center space-x-1 px-2 py-1 text-sm ${currentTheme.hover} rounded`}
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => setSelectedText('')}
                  className={`p-1 ${currentTheme.hover} rounded`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <Loader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p className="text-sm">Loading document...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer; 