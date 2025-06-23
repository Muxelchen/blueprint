import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Download,
  Share2,
  List,
  Music,
  Clock,
  Heart,
  Disc,
  Radio,
  Headphones,
  Settings,
  MoreHorizontal,
  AlertTriangle,
  Loader,
} from 'lucide-react';
import MediaService from '../../utils/MediaService';

interface AudioData {
  id: string;
  src: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: number;
  cover?: string;
  waveform?: number[];
  lyrics?: string;
  metadata?: {
    bitrate?: string;
    sampleRate?: string;
    size?: string;
    format?: string;
    year?: number;
    trackNumber?: number;
    totalTracks?: number;
  };
}

interface AudioWidgetProps {
  // Audio data - single track or playlist
  audio?: AudioData;
  audios?: AudioData[];
  
  // Display options
  mode?: 'single' | 'playlist' | 'radio';
  size?: 'compact' | 'medium' | 'large' | 'full';
  theme?: 'dark' | 'light' | 'gradient';
  
  // Player features
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  
  // Advanced features
  enableDownload?: boolean;
  enableShare?: boolean;
  enableLyrics?: boolean;
  enableEqualizer?: boolean;
  enableWaveform?: boolean;
  enableFavorites?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  showVolume?: boolean;
  showArtwork?: boolean;
  
  // Playlist options
  autoplayNext?: boolean;
  showPlaylist?: boolean;
  playlistPosition?: 'right' | 'bottom';
  enableShuffle?: boolean;
  enableRepeat?: boolean;
  enableCrossfade?: boolean;
  crossfadeDuration?: number;
  
  // Visual options
  showWaveform?: boolean;
  showSpectrum?: boolean;
  animateOnPlay?: boolean;
  showMetadata?: boolean;
  compactMode?: boolean;
  
  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  accentColor?: string;
  
  // Callbacks
  onPlay?: (audio: AudioData) => void;
  onPause?: (audio: AudioData) => void;
  onEnded?: (audio: AudioData) => void;
  onTimeUpdate?: (currentTime: number, duration: number, audio: AudioData) => void;
  onVolumeChange?: (volume: number) => void;
  onFavorite?: (audio: AudioData, isFavorited: boolean) => void;
  onError?: (error: string, audio: AudioData) => void;
  onAudioChange?: (audio: AudioData, index: number) => void;
}

// Mock data function that creates data when called
const getMockAudios = (): AudioData[] => [
  {
    id: 'sample-1',
    src: MediaService.getAudio('sample-1'),
    title: 'Sample Audio 1',
    artist: 'Local Demo',
    album: 'Test Collection',
    genre: 'Sound Effect',
    duration: 3,
    cover: MediaService.getImage('placeholder-1'),
    waveform: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.1) * 50 + 50),
    metadata: {
      bitrate: '128 kbps',
      sampleRate: '44.1 kHz',
      size: '48 KB',
      format: 'MP3',
      year: 2024,
      trackNumber: 1,
      totalTracks: 2,
    },
  },
  {
    id: 'sample-2',
    src: MediaService.getAudio('sample-2'),
    title: 'Sample Audio 2',
    artist: 'Local Demo',
    album: 'Test Collection',
    genre: 'Sound Effect',
    duration: 3,
    cover: MediaService.getImage('placeholder-2'),
    waveform: Array.from({ length: 100 }, (_, i) => Math.cos(i * 0.15) * 40 + 60),
    metadata: {
      bitrate: '128 kbps',
      sampleRate: '44.1 kHz',
      size: '48 KB',
      format: 'OGG',
      year: 2024,
      trackNumber: 2,
      totalTracks: 2,
    },
  },
];

const AudioWidget: React.FC<AudioWidgetProps> = ({
  audio,
  audios = getMockAudios(),
  mode = 'single',
  size = 'medium',
  theme = 'dark',
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
  enableDownload = false,
  enableShare = false,
  enableLyrics = false,
  enableEqualizer = false,
  enableWaveform = true,
  enableFavorites = true,
  showProgress = true,
  showTime = true,
  showVolume = true,
  showArtwork = true,
  autoplayNext = true,
  showPlaylist = true,
  playlistPosition = 'right',
  enableShuffle = true,
  enableRepeat = true,
  enableCrossfade = false,
  crossfadeDuration = 3,
  showWaveform = true,
  showSpectrum = false,
  animateOnPlay = true,
  showMetadata = true,
  compactMode = false,
  borderRadius = 'medium',
  shadow = 'medium',
  border = false,
  accentColor = '#3B82F6',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onFavorite,
  onError,
  onAudioChange,
}) => {
  // State management
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [equalizerBands, setEqualizerBands] = useState<number[]>(new Array(10).fill(0));
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(64).fill(0));

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Get current audio(s)
  const currentAudios = mode === 'single' && audio ? [audio] : audios;
  const currentAudio = currentAudios[currentAudioIndex];

  // Size configurations - Updated to be more flexible
  const sizeConfig = {
    compact: { minHeight: '80px', artworkSize: 'w-12 h-12' },
    medium: { minHeight: '120px', artworkSize: 'w-16 h-16' },
    large: { minHeight: '180px', artworkSize: 'w-24 h-24' },
    full: { minHeight: '240px', artworkSize: 'w-32 h-32' },
  };

  // Theme configurations
  const themeConfig = {
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      secondary: 'text-gray-300',
      accent: 'bg-blue-500',
      border: 'border-gray-700',
    },
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      secondary: 'text-gray-600',
      accent: 'bg-blue-500',
      border: 'border-gray-200',
    },
    gradient: {
      bg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
      text: 'text-white',
      secondary: 'text-gray-200',
      accent: 'bg-purple-500',
      border: 'border-purple-500',
    },
  };

  const currentTheme = themeConfig[theme];

  // Border radius configurations
  const borderRadiusConfig = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-xl',
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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Navigation functions (defined early to avoid dependency issues)
  const goToNext = useCallback(() => {
    let nextIndex;
    if (isShuffled) {
      do {
        nextIndex = Math.floor(Math.random() * currentAudios.length);
      } while (nextIndex === currentAudioIndex && currentAudios.length > 1);
    } else {
      nextIndex = (currentAudioIndex + 1) % currentAudios.length;
    }
    
    setCurrentAudioIndex(nextIndex);
    setCurrentTime(0);
    setHasError(false);
    setErrorMessage('');
    
    if (onAudioChange) {
      onAudioChange(currentAudios[nextIndex], nextIndex);
    }
  }, [currentAudioIndex, currentAudios, isShuffled, onAudioChange]);

  const goToPrevious = useCallback(() => {
    let prevIndex;
    if (isShuffled) {
      do {
        prevIndex = Math.floor(Math.random() * currentAudios.length);
      } while (prevIndex === currentAudioIndex && currentAudios.length > 1);
    } else {
      prevIndex = (currentAudioIndex - 1 + currentAudios.length) % currentAudios.length;
    }
    
    setCurrentAudioIndex(prevIndex);
    setCurrentTime(0);
    setHasError(false);
    setErrorMessage('');
    
    if (onAudioChange) {
      onAudioChange(currentAudios[prevIndex], prevIndex);
    }
  }, [currentAudioIndex, currentAudios, isShuffled, onAudioChange]);

  const goToAudio = useCallback((index: number) => {
    setCurrentAudioIndex(index);
    setCurrentTime(0);
    setHasError(false);
    setErrorMessage('');
    
    if (onAudioChange) {
      onAudioChange(currentAudios[index], index);
    }
  }, [currentAudios, onAudioChange]);

  // Audio event handlers
  const handleLoadStart = useCallback(() => {
    console.log('🎵 Audio loading started:', currentAudio.src);
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
  }, [currentAudio.src]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      console.log('🎵 Audio metadata loaded:', currentAudio.src, 'Duration:', audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
    }
  }, [currentAudio.src]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.currentTime)) {
      setCurrentTime(audio.currentTime);
      
      if (onTimeUpdate && currentAudio && isFinite(audio.duration)) {
        onTimeUpdate(audio.currentTime, audio.duration, currentAudio);
      }
      
      // Generate visualizer data (mock implementation)
      if (showSpectrum && isPlaying) {
        setVisualizerData(prev => 
          prev.map(() => Math.random() * 100)
        );
      }
    }
  }, [onTimeUpdate, currentAudio, showSpectrum, isPlaying]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    if (onPlay && currentAudio) {
      onPlay(currentAudio);
    }
  }, [onPlay, currentAudio]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (onPause && currentAudio) {
      onPause(currentAudio);
    }
  }, [onPause, currentAudio]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    
    if (onEnded && currentAudio) {
      onEnded(currentAudio);
    }
    
    // Handle repeat and auto-play next
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    } else if (autoplayNext && (repeatMode === 'all' || currentAudioIndex < currentAudios.length - 1)) {
      setTimeout(() => {
        if (currentAudioIndex < currentAudios.length - 1) {
          goToNext();
        } else if (repeatMode === 'all') {
          goToAudio(0);
        }
        // Auto-play the next track
        setTimeout(() => {
          const audio = audioRef.current;
          if (audio) {
            audio.play().catch(console.error);
          }
        }, 100);
      }, 1000);
    }
  }, [onEnded, currentAudio, repeatMode, autoplayNext, currentAudioIndex, currentAudios.length, goToNext, goToAudio]);

  const handleError = useCallback(() => {
    const audio = audioRef.current;
    const errorDetails = audio?.error;
    console.error('🎵 Audio error:', currentAudio.src, 'Error:', errorDetails?.message, 'Code:', errorDetails?.code);
    
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(errorDetails?.message || 'Failed to load audio');
    setIsPlaying(false);
    
    if (onError && currentAudio) {
      onError(errorDetails?.message || 'Failed to load audio', currentAudio);
    }
  }, [onError, currentAudio]);

  // Control functions
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error('Play failed:', error);
        setHasError(true);
        setErrorMessage('Failed to play audio');
      });
    }
  }, [isPlaying, hasError]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const newMuted = !isMuted;
      audio.muted = newMuted;
      setIsMuted(newMuted);
      
      if (onVolumeChange) {
        onVolumeChange(newMuted ? 0 : volume);
      }
    }
  }, [isMuted, volume, onVolumeChange]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audio.volume = clampedVolume;
      setVolume(clampedVolume);
      setIsMuted(clampedVolume === 0);
      
      if (onVolumeChange) {
        onVolumeChange(clampedVolume);
      }
    }
  }, [onVolumeChange]);

  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && isFinite(time) && time >= 0 && time <= audio.duration) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const skipForward = useCallback((seconds: number = 10) => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      const newTime = Math.min(audio.currentTime + seconds, audio.duration);
      handleSeek(newTime);
    }
  }, [handleSeek]);

  const skipBackward = useCallback((seconds: number = 10) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.max(audio.currentTime - seconds, 0);
      handleSeek(newTime);
    }
  }, [handleSeek]);

  // Toggle functions
  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  const toggleRepeat = useCallback(() => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  }, [repeatMode]);

  const toggleFavorite = useCallback(() => {
    if (!currentAudio) return;
    
    const newFavorites = new Set(favorites);
    const isFavorited = favorites.has(currentAudio.id);
    
    if (isFavorited) {
      newFavorites.delete(currentAudio.id);
    } else {
      newFavorites.add(currentAudio.id);
    }
    
    setFavorites(newFavorites);
    
    if (onFavorite) {
      onFavorite(currentAudio, !isFavorited);
    }
  }, [currentAudio, favorites, onFavorite]);

  // Download and share functions
  const handleDownload = useCallback(() => {
    if (!currentAudio || !enableDownload || !currentAudio.src) return;
    
    const link = document.createElement('a');
    link.href = currentAudio.src;
    link.download = `${currentAudio.artist} - ${currentAudio.title}` || 'audio';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentAudio, enableDownload]);

  const handleShare = useCallback(async () => {
    if (!currentAudio || !enableShare) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentAudio.artist} - ${currentAudio.title}`,
          text: `Listen to ${currentAudio.title} by ${currentAudio.artist}`,
          url: currentAudio.src,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentAudio.src);
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
      }
    }
  }, [currentAudio, enableShare]);

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
        case 's':
        case 'S':
          e.preventDefault();
          if (enableShuffle) toggleShuffle();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          if (enableRepeat) toggleRepeat();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          if (enableFavorites) toggleFavorite();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipBackward, skipForward, handleVolumeChange, volume, toggleMute, toggleShuffle, toggleRepeat, toggleFavorite, enableShuffle, enableRepeat, enableFavorites]);

  // Reset states when audio changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setHasError(false);
    setErrorMessage('');
    setVisualizerData(new Array(64).fill(0));
  }, [currentAudio?.id]);

  // Sync muted state with prop
  useEffect(() => {
    setIsMuted(muted);
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
    }
  }, [muted]);

  if (!currentAudio) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No audio provided</p>
        </div>
      </div>
    );
  }

  const containerClasses = `
    ${currentTheme.bg} ${currentTheme.text}
    ${borderRadiusConfig[borderRadius]}
    ${shadowConfig[shadow]}
    ${border ? `border ${currentTheme.border}` : ''}
    overflow-hidden
    transition-all duration-300
  `.trim();

  return (
    <div className="w-full">
      <div className="flex gap-4">
        {/* Audio Player */}
        <div className={`flex-1 ${mode === 'playlist' && showPlaylist && playlistPosition === 'right' ? 'w-2/3' : ''}`}>
          <div 
            ref={containerRef}
            className={containerClasses}
            tabIndex={0}
            style={{ minHeight: sizeConfig[size].minHeight }}
          >
            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={currentAudio.src}
              preload={preload}
              loop={loop && repeatMode === 'one'}
              muted={isMuted}
              autoPlay={false}
              onLoadStart={handleLoadStart}
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={() => console.log('🎵 Audio can play:', currentAudio.src)}
              onLoadedData={() => console.log('🎵 Audio data loaded:', currentAudio.src)}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleError}
            />

            {/* Main Content */}
            <div className="flex items-center p-4 gap-4">
              {/* Artwork */}
              {showArtwork && (
                <div className={`${sizeConfig[size].artworkSize} flex-shrink-0 relative`}>
                  {currentAudio.cover ? (
                    <img
                      src={currentAudio.cover}
                      alt={currentAudio.title}
                      className={`w-full h-full object-cover ${borderRadiusConfig[borderRadius]} ${animateOnPlay && isPlaying ? 'animate-pulse' : ''}`}
                    />
                  ) : (
                    <div className={`w-full h-full ${currentTheme.accent} ${borderRadiusConfig[borderRadius]} flex items-center justify-center`}>
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  {/* Loading/Error Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                      <div className="text-center text-white">
                        <Loader className="w-4 h-4 animate-spin mx-auto mb-1" />
                        <div className="text-xs">Loading...</div>
                      </div>
                    </div>
                  )}
                  
                  {hasError && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center rounded">
                      <div className="text-center text-white">
                        <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                        <div className="text-xs">Error</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Track Info and Controls */}
              <div className="flex-1 min-w-0">
                {/* Track Info */}
                {showMetadata && (
                  <div className="mb-2">
                    <h3 className={`font-semibold text-sm truncate ${currentTheme.text}`}>
                      {currentAudio.title}
                    </h3>
                    {currentAudio.artist && (
                      <p className={`text-xs truncate ${currentTheme.secondary}`}>
                        {currentAudio.artist}
                        {currentAudio.album && ` • ${currentAudio.album}`}
                      </p>
                    )}
                  </div>
                )}

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
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: duration > 0 ? `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${(currentTime / duration) * 100}%, #6B7280 ${(currentTime / duration) * 100}%, #6B7280 100%)` : '#6B7280'
                        }}
                      />
                    </div>
                    
                    {/* Time Display */}
                    {showTime && (
                      <div className={`flex justify-between text-xs mt-1 ${currentTheme.secondary}`}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Waveform */}
                {enableWaveform && showWaveform && currentAudio.waveform && (
                  <div className="mb-3">
                    <div className="flex items-end gap-1 h-8">
                      {currentAudio.waveform.slice(0, 50).map((value, index) => (
                        <div
                          key={index}
                          className={`w-1 bg-gradient-to-t from-gray-400 to-transparent transition-all duration-150`}
                          style={{
                            height: `${Math.max(2, (value / 100) * 32)}px`,
                            opacity: duration > 0 && (index / 50) <= (currentTime / duration) ? 1 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Control Buttons */}
                {controls && (
                  <div className="flex items-center gap-2">
                    {/* Previous Track */}
                    {mode !== 'single' && currentAudios.length > 1 && (
                      <button
                        onClick={goToPrevious}
                        className={`p-1 ${currentTheme.text} hover:${currentTheme.accent} hover:text-white rounded transition-colors`}
                        title="Previous Track"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                    )}

                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      disabled={hasError}
                      className={`p-2 ${currentTheme.accent} text-white rounded-full hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    {/* Next Track */}
                    {mode !== 'single' && currentAudios.length > 1 && (
                      <button
                        onClick={goToNext}
                        className={`p-1 ${currentTheme.text} hover:${currentTheme.accent} hover:text-white rounded transition-colors`}
                        title="Next Track"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    )}

                    {/* Volume Control */}
                    {showVolume && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={toggleMute}
                          className={`p-1 ${currentTheme.text} hover:${currentTheme.accent} hover:text-white rounded transition-colors`}
                          title={isMuted ? 'Unmute' : 'Mute'}
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
                          className="w-12 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Additional Controls */}
                    <div className="flex items-center gap-1 ml-auto">
                      {/* Favorite */}
                      {enableFavorites && (
                        <button
                          onClick={toggleFavorite}
                          className={`p-1 ${favorites.has(currentAudio.id) ? 'text-red-500' : currentTheme.text} hover:text-red-500 rounded transition-colors`}
                          title="Toggle Favorite"
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(currentAudio.id) ? 'fill-current' : ''}`} />
                        </button>
                      )}

                      {/* Shuffle */}
                      {enableShuffle && mode !== 'single' && (
                        <button
                          onClick={toggleShuffle}
                          className={`p-1 ${isShuffled ? currentTheme.accent : currentTheme.text} hover:${currentTheme.accent} rounded transition-colors`}
                          title="Toggle Shuffle"
                        >
                          <Shuffle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Repeat */}
                      {enableRepeat && (
                        <button
                          onClick={toggleRepeat}
                          className={`p-1 ${repeatMode !== 'none' ? currentTheme.accent : currentTheme.text} hover:${currentTheme.accent} rounded transition-colors relative`}
                          title={`Repeat: ${repeatMode}`}
                        >
                          <Repeat className="w-4 h-4" />
                          {repeatMode === 'one' && (
                            <span className="absolute -top-1 -right-1 text-xs font-bold">1</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm mb-1">{errorMessage}</p>
                  <p className="text-xs text-gray-300 mb-3">URL: {currentAudio.src}</p>
                  <button
                    onClick={() => {
                      setHasError(false);
                      setErrorMessage('');
                      const audio = audioRef.current;
                      if (audio) {
                        audio.load();
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Retry
                  </button>
                </div>
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
        {mode !== 'single' && showPlaylist && currentAudios.length > 1 && (
          <div className={`
            ${playlistPosition === 'right' ? 'w-1/3' : 'w-full mt-4'}
            bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto
          `}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <List className="w-5 h-5" />
              Playlist ({currentAudios.length})
            </h3>
            <div className="space-y-2">
              {currentAudios.map((audioItem, index) => (
                <div
                  key={audioItem.id}
                  onClick={() => goToAudio(index)}
                  className={`
                    flex gap-3 p-2 rounded cursor-pointer transition-colors
                    ${index === currentAudioIndex 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded overflow-hidden">
                      {audioItem.cover ? (
                        <img
                          src={audioItem.cover}
                          alt={audioItem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <Music className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                    {index === currentAudioIndex && isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    )}
                    {favorites.has(audioItem.id) && (
                      <Heart className="absolute -top-1 -right-1 w-3 h-3 text-red-500 fill-current" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{audioItem.title}</h4>
                    {audioItem.artist && (
                      <p className="text-xs text-gray-600 truncate">{audioItem.artist}</p>
                    )}
                    {audioItem.duration && (
                      <p className="text-xs text-gray-500 mt-1">{formatTime(audioItem.duration)}</p>
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

export default AudioWidget; 