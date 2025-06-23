// Widget-specific types and interfaces
import { BaseComponent, ComponentSize } from './index';
import type { ChartData, ChartOptions } from './charts';

// KPI Data structure for mock data
export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  previousValue?: number;
  change: number; // Made required to match mock data
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  color?: string;
  target?: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage';
  changePercent?: number;
  description?: string;
}

// User type for mock data
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  permissions?: string[];
}

// Progress Bar
export interface ProgressBarProps extends BaseComponent {
  value: number;
  max?: number;
  min?: number;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: ComponentSize;
  animated?: boolean;
  striped?: boolean;
  label?: string;
  color?: string;
  backgroundColor?: string;
}

// KPI Card
export interface KPICardProps extends BaseComponent {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  color?: string;
  size?: ComponentSize;
  loading?: boolean;
  onClick?: () => void;
}

// Data Table
export interface DataTableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  fixed?: 'left' | 'right';
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
  filters?: { text: string; value: any }[];
  onFilter?: (value: any, record: any) => boolean;
}

export interface DataTableProps extends BaseComponent {
  columns: DataTableColumn[];
  dataSource: any[];
  rowKey?: string | ((record: any) => string);
  loading?: boolean;
  pagination?: boolean | PaginationConfig;
  scroll?: { x?: number | string; y?: number | string };
  size?: ComponentSize;
  bordered?: boolean;
  showHeader?: boolean;
  expandable?: {
    expandedRowRender?: (record: any, index: number) => React.ReactNode;
    expandRowByClick?: boolean;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: string[];
    expandedRowKeys?: string[];
    onExpand?: (expanded: boolean, record: any) => void;
    onExpandedRowsChange?: (expandedRows: string[]) => void;
  };
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: string[];
    onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void;
    onSelect?: (record: any, selected: boolean, selectedRows: any[]) => void;
    onSelectAll?: (selected: boolean, selectedRows: any[], changeRows: any[]) => void;
    getCheckboxProps?: (record: any) => any;
  };
  onRow?: (record: any, index?: number) => any;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
}

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  onChange?: (page: number, pageSize?: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

// Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  url?: string;
  classNames?: string[];
  extendedProps?: Record<string, any>;
}

export interface CalendarProps extends BaseComponent {
  events: CalendarEvent[];
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  initialDate?: Date;
  height?: number | string;
  editable?: boolean;
  selectable?: boolean;
  selectMirror?: boolean;
  dayMaxEvents?: boolean | number;
  weekends?: boolean;
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
  businessHours?: {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  };
  eventClick?: (info: any) => void;
  dateSelect?: (info: any) => void;
  eventDrop?: (info: any) => void;
  eventResize?: (info: any) => void;
  datesSet?: (info: any) => void;
}

// Timeline
export interface TimelineItem {
  id: string;
  timestamp: Date;
  title: string;
  description?: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: string;
  color?: string;
  children?: React.ReactNode;
}

export interface TimelineProps extends BaseComponent {
  items: TimelineItem[];
  mode?: 'left' | 'alternate' | 'right';
  pending?: boolean | React.ReactNode;
  reverse?: boolean;
  size?: ComponentSize;
}

// Weather Widget
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  forecast?: WeatherForecast[];
}

export interface WeatherForecast {
  date: Date;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface WeatherWidgetProps extends BaseComponent {
  data: WeatherData;
  unit?: 'celsius' | 'fahrenheit';
  showForecast?: boolean;
  forecastDays?: number;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

// Chart Widget Props (using imported types from charts.ts)
export interface LineChartWidgetProps extends BaseComponent {
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  height?: number;
}

export interface BarChartWidgetProps extends BaseComponent {
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  height?: number;
}

export interface AreaChartWidgetProps extends BaseComponent {
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  height?: number;
}

export interface PieChartWidgetProps extends BaseComponent {
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  height?: number;
}

export interface DonutChartWidgetProps extends BaseComponent {
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  height?: number;
}

export interface ScatterPlotWidgetProps extends BaseComponent {
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  height?: number;
}

export interface GaugeChartWidgetProps extends BaseComponent {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  height?: number;
}

export interface HeatmapWidgetProps extends BaseComponent {
  data: any[][];
  title?: string;
  height?: number;
}

// =============================================================================
// 🖼️ MEDIA & CONTENT WIDGET TYPES
// =============================================================================

// Image Widget Types
export interface ImageData {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  caption?: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  tags?: string[];
  metadata?: {
    size?: string;
    format?: string;
    dimensions?: string;
    camera?: string;
    location?: string;
    date?: Date;
  };
}

export interface ImageWidgetProps {
  // Image data - single image or gallery
  image?: ImageData;
  images?: ImageData[];
  
  // Display modes
  mode?: 'single' | 'gallery' | 'slideshow';
  size?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  
  // Features
  enableZoom?: boolean;
  enableRotation?: boolean;
  enableDownload?: boolean;
  enableShare?: boolean;
  enableLightbox?: boolean;
  enableLazyLoading?: boolean;
  showMetadata?: boolean;
  showCaption?: boolean;
  
  // Gallery specific
  showThumbnails?: boolean;
  thumbnailPosition?: 'bottom' | 'right' | 'left';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  
  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  
  // Callbacks
  onImageChange?: (image: ImageData, index: number) => void;
  onZoom?: (zoomLevel: number) => void;
  onDownload?: (image: ImageData) => void;
  onShare?: (image: ImageData) => void;
  onError?: (error: string, image: ImageData) => void;
}

// Video Widget Types
export interface VideoData {
  id: string;
  src: string;
  title: string;
  description?: string;
  duration?: number;
  thumbnail?: string;
  poster?: string;
  subtitles?: Array<{
    language: string;
    label: string;
    src: string;
    default?: boolean;
  }>;
  chapters?: Array<{
    title: string;
    startTime: number;
    thumbnail?: string;
  }>;
  metadata?: {
    resolution?: string;
    frameRate?: string;
    bitrate?: string;
    codec?: string;
    size?: string;
    uploadDate?: Date;
    views?: number;
  };
}

export interface VideoWidgetProps {
  // Video data - single video or playlist
  video?: VideoData;
  videos?: VideoData[];
  
  // Player settings
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  
  // Display options
  aspectRatio?: '16:9' | '4:3' | '21:9' | '9:16' | 'auto';
  size?: 'small' | 'medium' | 'large' | 'full';
  theme?: 'dark' | 'light';
  
  // Advanced features
  enableFullscreen?: boolean;
  enablePictureInPicture?: boolean;
  enableSubtitles?: boolean;
  enableChapters?: boolean;
  enablePlaybackSpeed?: boolean;
  enableQualitySelection?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  showVolume?: boolean;
  
  // Playlist options
  showPlaylist?: boolean;
  playlistPosition?: 'right' | 'bottom';
  autoplayNext?: boolean;
  shufflePlaylist?: boolean;
  
  // Styling
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  
  // Callbacks
  onPlay?: (video: VideoData) => void;
  onPause?: (video: VideoData) => void;
  onEnded?: (video: VideoData) => void;
  onTimeUpdate?: (currentTime: number, duration: number, video: VideoData) => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreen?: (isFullscreen: boolean) => void;
  onVideoChange?: (video: VideoData, index: number) => void;
  onError?: (error: string, video: VideoData) => void;
}

// Audio Widget Types
export interface AudioData {
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

export interface AudioWidgetProps {
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

// Document Viewer Types
export interface DocumentData {
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

export interface DocumentViewerProps {
  // Document data
  document?: DocumentData;
  documents?: DocumentData[];
  
  // Display options
  mode?: 'single' | 'multiple';
  viewMode?: 'page' | 'continuous' | 'facing' | 'thumbnails';
  initialPage?: number;
  initialZoom?: number;
  fitToWidth?: boolean;
  
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
  autoPlay?: boolean;
  autoPlayInterval?: number;
  
  // UI Options
  showToolbar?: boolean;
  showSidebar?: boolean;
  sidebarPosition?: 'left' | 'right';
  theme?: 'light' | 'dark' | 'auto';
  compactMode?: boolean;
  
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
  onDocumentLoad?: (document: DocumentData) => void;
  onDocumentError?: (error: string, document: DocumentData) => void;
  onDownload?: (document: DocumentData) => void;
  onPrint?: (document: DocumentData) => void;
}

// Code Block Types
export interface CodeData {
  id: string;
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  description?: string;
  author?: string;
  metadata?: {
    lines?: number;
    size?: string;
    framework?: string;
  };
}

export interface CodeBlockProps {
  code?: string;
  codeData?: CodeData;
  language?: string;
  theme?: 'light' | 'dark' | 'github' | 'monokai';
  fontSize?: 'small' | 'medium' | 'large';
  showLineNumbers?: boolean;
  enableCopy?: boolean;
  enableDownload?: boolean;
  enableFullscreen?: boolean;
  enableWordWrap?: boolean;
  enableSearch?: boolean;
  maxHeight?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  onCopy?: (code: string) => void;
  onDownload?: (code: string, filename?: string) => void;
}

// Re-export chart types for widgets
export type { TreemapNode, TreemapProps, RealtimeChartProps } from './charts';
