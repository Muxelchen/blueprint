import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings,
  Download,
  Share2,
  Subtitles,
  List,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader,
} from 'lucide-react';
import MediaService from '../../utils/MediaService';

interface VideoData {
  id: string;
  src: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  poster?: string;
  subtitles?: SubtitleTrack[];
  metadata?: {
    resolution?: string;
    size?: string;
    format?: string;
    codec?: string;
    author?: string;
    date?: string;
    tags?: string[];
  };
}

interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src: string;
  default?: boolean;
}

interface VideoWidgetProps {
  // Video data - single video or playlist
  video?: VideoData;
  videos?: VideoData[];
  
  // Display options
  mode?: 'single' | 'playlist';
  size?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: 'square' | '16:9' | '4:3' | '21:9' | 'auto';
  
  // Player features
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  
  // Advanced features
  enableFullscreen?: boolean;
  enablePictureInPicture?: boolean;
  enableDownload?: boolean;
  enableShare?: boolean;
  enableSubtitles?: boolean;
  enablePlaylist?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  showVolume?: boolean;
  
  // Playlist options
  autoplayNext?: boolean;
  showPlaylist?: boolean;
  playlistPosition?: 'right' | 'bottom';
  enableShuffle?: boolean;
  enableRepeat?: boolean;
  
  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  
  // Performance
  lazy?: boolean;
  lowLatency?: boolean;
  bufferTime?: number;
  
  // Callbacks
  onPlay?: (video: VideoData) => void;
  onPause?: (video: VideoData) => void;
  onEnded?: (video: VideoData) => void;
  onTimeUpdate?: (currentTime: number, duration: number, video: VideoData) => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onError?: (error: string, video: VideoData) => void;
  onVideoChange?: (video: VideoData, index: number) => void;
}

// Mock data function that creates data when called
const getMockVideos = (): VideoData[] => [
  {
    id: 'demo-1',
    src: MediaService.getVideo('demo-1'),
    title: 'Demo Video 1',
    description: 'Local demo video using MediaService',
    thumbnail: MediaService.getImage('placeholder-1'),
    duration: 596,
    poster: MediaService.getImage('placeholder-1'),
    metadata: {
      resolution: '1280x720',
      size: '158 MB',
      format: 'MP4',
      codec: 'H.264',
      author: 'Local Demo',
      date: '2024-01-01',
      tags: ['demo', 'test video'],
    },
  },
];

const VideoWidget: React.FC<VideoWidgetProps> = ({
  video,
  videos = getMockVideos(),
  mode = 'single',
  size = 'medium',
  aspectRatio = '16:9',
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
  enableFullscreen = true,
  enablePictureInPicture = true,
  enableDownload = false,
  enableShare = false,
  enableSubtitles = true,
  enablePlaylist = true,
  showProgress = true,
  showTime = true,
  showVolume = true,
  autoplayNext = false,
  showPlaylist = true,
  playlistPosition = 'right',
  enableShuffle = false,
  enableRepeat = false,
  borderRadius = 'medium',
  shadow = 'small',
  border = false,
  theme = 'dark',
  lazy = true,
  lowLatency = false,
  bufferTime = 3,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onFullscreenChange,
  onError,
  onVideoChange,
}) => {
  // State management
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Get current video(s)
  const currentVideos = mode === 'single' && video ? [video] : videos;
  const currentVideo = currentVideos[currentVideoIndex];

  // Size configurations
  const sizeConfig = {
    small: { maxWidth: '300px', height: '200px' },
    medium: { maxWidth: '500px', height: '300px' },
    large: { maxWidth: '800px', height: '450px' },
    full: { width: '100%', height: '400px' },
  };

  // Aspect ratio configurations
  const aspectRatioConfig = {
    square: 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '21:9': 'aspect-[21/9]',
    auto: '',
  };

  // Border radius configurations
  const borderRadiusConfig = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
  };

  // Shadow configurations
  const shadowConfig = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };

  // Format time helper
  const formatTime = useCallback((time: number): string => {
    if (!isFinite(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Navigation functions (defined early to avoid dependency issues)
  const goToNext = useCallback(() => {
    if (currentVideoIndex < currentVideos.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setCurrentTime(0);
      setHasError(false);
      
      if (onVideoChange) {
        onVideoChange(currentVideos[newIndex], newIndex);
      }
    }
  }, [currentVideoIndex, currentVideos, onVideoChange]);

  const goToPrevious = useCallback(() => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      setCurrentTime(0);
      setHasError(false);
      
      if (onVideoChange) {
        onVideoChange(currentVideos[newIndex], newIndex);
      }
    }
  }, [currentVideoIndex, currentVideos, onVideoChange]);

  const goToVideo = useCallback((index: number) => {
    setCurrentVideoIndex(index);
    setCurrentTime(0);
    setHasError(false);
    
    if (onVideoChange) {
      onVideoChange(currentVideos[index], index);
    }
  }, [currentVideos, onVideoChange]);

  // Video event handlers
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && isFinite(video.duration)) {
      setDuration(video.duration);
      setIsLoading(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && isFinite(video.currentTime)) {
      setCurrentTime(video.currentTime);
      
      if (video.buffered && video.buffered.length > 0) {
        setBuffered(video.buffered);
      }
      
      if (onTimeUpdate && currentVideo && isFinite(video.duration)) {
        onTimeUpdate(video.currentTime, video.duration, currentVideo);
      }
    }
  }, [onTimeUpdate, currentVideo]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    if (onPlay && currentVideo) {
      onPlay(currentVideo);
    }
  }, [onPlay, currentVideo]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (onPause && currentVideo) {
      onPause(currentVideo);
    }
  }, [onPause, currentVideo]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    
    if (onEnded && currentVideo) {
      onEnded(currentVideo);
    }
    
    // Auto-play next video if enabled
    if (autoplayNext && mode !== 'single' && currentVideoIndex < currentVideos.length - 1) {
      setTimeout(() => {
        goToNext();
        // Auto-play the next video after a short delay
        setTimeout(() => {
          const video = videoRef.current;
          if (video) {
            video.play().catch(console.error);
          }
        }, 100);
      }, 1000);
    }
  }, [onEnded, currentVideo, autoplayNext, mode, currentVideoIndex, currentVideos.length, goToNext]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Failed to load video');
    setIsPlaying(false);
    
    if (onError && currentVideo) {
      onError('Failed to load video', currentVideo);
    }
  }, [onError, currentVideo]);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
    setIsLoading(false);
  }, []);

  // Control functions
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || hasError) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error('Play failed:', error);
        setHasError(true);
        setErrorMessage('Failed to play video');
      });
    }
  }, [isPlaying, hasError]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const newMuted = !isMuted;
      video.muted = newMuted;
      setIsMuted(newMuted);
      
      if (onVolumeChange) {
        onVolumeChange(newMuted ? 0 : volume);
      }
    }
  }, [isMuted, volume, onVolumeChange]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (video) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      video.volume = clampedVolume;
      setVolume(clampedVolume);
      setIsMuted(clampedVolume === 0);
      
      if (onVolumeChange) {
        onVolumeChange(clampedVolume);
      }
    }
  }, [onVolumeChange]);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (video && isFinite(time) && time >= 0 && time <= video.duration) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const skipForward = useCallback((seconds: number = 10) => {
    const video = videoRef.current;
    if (video && isFinite(video.duration)) {
      const newTime = Math.min(video.currentTime + seconds, video.duration);
      handleSeek(newTime);
    }
  }, [handleSeek]);

  const skipBackward = useCallback((seconds: number = 10) => {
    const video = videoRef.current;
    if (video) {
      const newTime = Math.max(video.currentTime - seconds, 0);
      handleSeek(newTime);
    }
  }, [handleSeek]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container || !enableFullscreen) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(console.error);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      }
    }
  }, [isFullscreen, enableFullscreen]);

  // Picture-in-Picture functionality
  const togglePictureInPicture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !enablePictureInPicture) return;

    if (!isPictureInPicture) {
      if (video.requestPictureInPicture) {
        video.requestPictureInPicture().catch(() => {
          console.log('Picture-in-Picture not supported');
        });
      }
    } else {
      if (document.exitPictureInPicture) {
        document.exitPictureInPicture().catch(console.error);
      }
    }
  }, [isPictureInPicture, enablePictureInPicture]);

  // Download functionality
  const handleDownload = useCallback(() => {
    if (!currentVideo || !enableDownload || !currentVideo.src) return;
    
    const link = document.createElement('a');
    link.href = currentVideo.src;
    link.download = currentVideo.title || 'video';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentVideo, enableDownload]);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (!currentVideo || !enableShare) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentVideo.title,
          text: currentVideo.description,
          url: currentVideo.src,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentVideo.src);
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
      }
    }
  }, [currentVideo, enableShare]);

  // Controls visibility management
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container || !container.contains(document.activeElement as Node)) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (enableFullscreen) toggleFullscreen();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          if (enablePictureInPicture) togglePictureInPicture();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipBackward, skipForward, handleVolumeChange, volume, toggleMute, toggleFullscreen, togglePictureInPicture, enableFullscreen, enablePictureInPicture]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenNow);
      
      if (onFullscreenChange) {
        onFullscreenChange(isFullscreenNow);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onFullscreenChange]);

  // Picture-in-Picture change listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePipEnter = () => setIsPictureInPicture(true);
    const handlePipLeave = () => setIsPictureInPicture(false);

    video.addEventListener('enterpictureinpicture', handlePipEnter);
    video.addEventListener('leavepictureinpicture', handlePipLeave);

    return () => {
      video.removeEventListener('enterpictureinpicture', handlePipEnter);
      video.removeEventListener('leavepictureinpicture', handlePipLeave);
    };
  }, [currentVideo?.id]); // Re-run when video changes

  // Reset states when video changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setHasError(false);
    setErrorMessage('');
    setIsBuffering(false);
    setBuffered(null);
  }, [currentVideo?.id]);

  // Sync muted state with prop
  useEffect(() => {
    setIsMuted(muted);
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
    }
  }, [muted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No video provided</p>
        </div>
      </div>
    );
  }

  const containerClasses = `
    relative bg-black
    ${aspectRatioConfig[aspectRatio]}
    ${borderRadiusConfig[borderRadius]}
    ${shadowConfig[shadow]}
    ${border ? 'border border-gray-200' : ''}
    overflow-hidden
    group
    ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
  `.trim();

  return (
    <div className="w-full" style={size !== 'full' ? sizeConfig[size] : undefined}>
      <div className="flex gap-4">
        {/* Video Player */}
        <div className={`flex-1 ${mode === 'playlist' && showPlaylist && playlistPosition === 'right' ? 'w-2/3' : ''}`}>
          <div 
            ref={containerRef}
            className={containerClasses}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            tabIndex={0}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              src={currentVideo.src}
              poster={currentVideo.poster}
              preload={preload}
              loop={loop}
              muted={isMuted}
              autoPlay={autoplay}
              className="w-full h-full object-cover"
              onLoadStart={handleLoadStart}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleError}
              onWaiting={handleWaiting}
              onCanPlay={handleCanPlay}
              crossOrigin="anonymous"
            >
              {/* Subtitles */}
              {enableSubtitles && currentVideo.subtitles?.map((subtitle) => (
                <track
                  key={subtitle.id}
                  kind="subtitles"
                  src={subtitle.src}
                  srcLang={subtitle.language}
                  label={subtitle.label}
                  default={subtitle.default}
                />
              ))}
            </video>

            {/* Loading State */}
            {(isLoading || isBuffering) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-white">
                  <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">{isBuffering ? 'Buffering...' : 'Loading...'}</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                <div className="text-center text-white">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{errorMessage}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && !isLoading && !hasError && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity hover:bg-opacity-50"
                onClick={togglePlay}
              >
                <Play className="w-16 h-16 text-white hover:scale-110 transition-transform" />
              </div>
            )}

            {/* Video Controls */}
            {controls && (showControls || !isPlaying) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-opacity duration-300">
                {/* Progress Bar */}
                {showProgress && (
                  <div className="mb-3">
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: duration > 0 ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #6B7280 ${(currentTime / duration) * 100}%, #6B7280 100%)` : '#6B7280'
                        }}
                      />
                      
                      {/* Buffer indicator */}
                      {buffered && duration > 0 && (
                        <div className="absolute top-0 h-1 pointer-events-none">
                          {Array.from({ length: buffered.length }, (_, i) => {
                            try {
                              const start = buffered.start(i);
                              const end = buffered.end(i);
                              return (
                                <div
                                  key={i}
                                  className="absolute h-full bg-gray-400 opacity-50"
                                  style={{
                                    left: `${(start / duration) * 100}%`,
                                    width: `${((end - start) / duration) * 100}%`,
                                  }}
                                />
                              );
                            } catch {
                              return null;
                            }
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      disabled={hasError}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>

                    {/* Skip buttons for playlist */}
                    {mode !== 'single' && currentVideos.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          disabled={currentVideoIndex === 0}
                          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>
                        <button
                          onClick={goToNext}
                          disabled={currentVideoIndex === currentVideos.length - 1}
                          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Time Display */}
                    {showTime && (
                      <span className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Volume Control */}
                    {showVolume && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                        >
                          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Settings */}
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Picture-in-Picture */}
                    {enablePictureInPicture && (
                      <button
                        onClick={togglePictureInPicture}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      >
                        <Minimize className="w-4 h-4" />
                      </button>
                    )}

                    {/* Fullscreen */}
                    {enableFullscreen && (
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Video Info Overlay */}
            {currentVideo.title && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                {currentVideo.title}
              </div>
            )}

            {/* Playlist Counter */}
            {mode !== 'single' && currentVideos.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                {currentVideoIndex + 1} / {currentVideos.length}
              </div>
            )}
          </div>

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
        </div>

        {/* Playlist */}
        {mode !== 'single' && showPlaylist && currentVideos.length > 1 && (
          <div className={`
            ${playlistPosition === 'right' ? 'w-1/3' : 'w-full mt-4'}
            bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto
          `}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <List className="w-5 h-5" />
              Playlist ({currentVideos.length})
            </h3>
            <div className="space-y-2">
              {currentVideos.map((videoItem, index) => (
                <div
                  key={videoItem.id}
                  onClick={() => goToVideo(index)}
                  className={`
                    flex gap-3 p-2 rounded cursor-pointer transition-colors
                    ${index === currentVideoIndex 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={videoItem.thumbnail || videoItem.poster}
                      alt={videoItem.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    {index === currentVideoIndex && isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{videoItem.title}</h4>
                    {videoItem.description && (
                      <p className="text-xs text-gray-600 truncate">{videoItem.description}</p>
                    )}
                    {videoItem.duration && (
                      <p className="text-xs text-gray-500 mt-1">{formatTime(videoItem.duration)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoWidget;