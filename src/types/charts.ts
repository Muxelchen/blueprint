// Complete chart types and interfaces
import { BaseComponent } from './index';

// Base chart types
export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'area' 
  | 'pie' 
  | 'donut' 
  | 'scatter' 
  | 'bubble' 
  | 'radar' 
  | 'polar' 
  | 'gauge' 
  | 'funnel' 
  | 'heatmap' 
  | 'treemap' 
  | 'sankey' 
  | 'candlestick' 
  | 'waterfall' 
  | 'box' 
  | 'violin' 
  | 'histogram' 
  | 'realtime';

export type ColorScheme = 
  | 'blue' 
  | 'green' 
  | 'red' 
  | 'purple' 
  | 'orange' 
  | 'teal' 
  | 'pink' 
  | 'indigo' 
  | 'gray' 
  | 'rainbow' 
  | 'custom';

// Base chart interfaces
export interface BaseChart extends BaseComponent {
  title?: string;
  subtitle?: string;
  width?: number | string;
  height?: number | string;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  loading?: boolean;
  error?: string;
  noDataMessage?: string;
  colorScheme?: ColorScheme;
  customColors?: string[];
  theme?: 'light' | 'dark' | 'auto';
  animation?: boolean;
  animationDuration?: number;
  onClick?: (event: ChartClickEvent) => void;
  onHover?: (event: ChartHoverEvent) => void;
  onLegendClick?: (event: ChartLegendEvent) => void;
}

// Chart data types
export interface ChartDataPoint {
  id?: string | number;
  label?: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartDataset {
  id?: string;
  label: string;
  data: number[] | ChartDataPoint[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean | string;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  hidden?: boolean;
  yAxisID?: string;
  type?: ChartType;
  stack?: string;
  order?: number;
  metadata?: Record<string, any>;
}

export interface ChartData {
  labels?: string[];
  datasets: ChartDataset[];
  metadata?: Record<string, any>;
}

// Chart configuration
export interface ChartAxis {
  id?: string;
  type?: 'linear' | 'logarithmic' | 'category' | 'time' | 'timeseries';
  position?: 'top' | 'bottom' | 'left' | 'right';
  display?: boolean;
  title?: {
    display: boolean;
    text: string;
    color?: string;
    font?: ChartFont;
  };
  min?: number;
  max?: number;
  suggestedMin?: number;
  suggestedMax?: number;
  ticks?: {
    display?: boolean;
    color?: string;
    font?: ChartFont;
    stepSize?: number;
    precision?: number;
    format?: string;
    callback?: (value: any, index: number, values: any[]) => string;
  };
  grid?: {
    display?: boolean;
    color?: string;
    lineWidth?: number;
    drawBorder?: boolean;
    drawOnChartArea?: boolean;
    drawTicks?: boolean;
  };
  time?: {
    unit?: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    stepSize?: number;
    displayFormats?: Record<string, string>;
    tooltipFormat?: string;
    parser?: string | ((value: any) => Date);
  };
  beginAtZero?: boolean;
}

export interface ChartFont {
  family?: string;
  size?: number;
  style?: 'normal' | 'italic' | 'oblique';
  weight?: string | number;
  lineHeight?: number | string;
}

export interface ChartLegend {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'chartArea';
  align?: 'start' | 'center' | 'end';
  labels?: {
    color?: string;
    font?: ChartFont;
    padding?: number;
    usePointStyle?: boolean;
    pointStyle?: string;
    filter?: (legendItem: any, chartData: ChartData) => boolean;
    sort?: (a: any, b: any, chartData: ChartData) => number;
  };
  onClick?: (event: Event, legendItem: any, legend: any) => void;
  onHover?: (event: Event, legendItem: any, legend: any) => void;
  onLeave?: (event: Event, legendItem: any, legend: any) => void;
}

export interface ChartTooltip {
  enabled?: boolean;
  mode?: 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';
  intersect?: boolean;
  position?: 'average' | 'nearest';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  titleColor?: string;
  titleFont?: ChartFont;
  bodyColor?: string;
  bodyFont?: ChartFont;
  footerColor?: string;
  footerFont?: ChartFont;
  padding?: number;
  cornerRadius?: number;
  displayColors?: boolean;
  multiKeyBackground?: string;
  filter?: (tooltipItem: any, data: ChartData) => boolean;
  itemSort?: (a: any, b: any, data: ChartData) => number;
  external?: (context: any) => void;
  callbacks?: {
    beforeTitle?: (tooltipItems: any[]) => string | string[];
    title?: (tooltipItems: any[]) => string | string[];
    afterTitle?: (tooltipItems: any[]) => string | string[];
    beforeBody?: (tooltipItems: any[]) => string | string[];
    beforeLabel?: (tooltipItem: any) => string | string[];
    label?: (tooltipItem: any) => string | string[];
    labelColor?: (tooltipItem: any) => { borderColor: string; backgroundColor: string };
    labelTextColor?: (tooltipItem: any) => string;
    labelPointStyle?: (tooltipItem: any) => { pointStyle: string; rotation: number };
    afterLabel?: (tooltipItem: any) => string | string[];
    afterBody?: (tooltipItems: any[]) => string | string[];
    beforeFooter?: (tooltipItems: any[]) => string | string[];
    footer?: (tooltipItems: any[]) => string | string[];
    afterFooter?: (tooltipItems: any[]) => string | string[];
  };
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  devicePixelRatio?: number;
  locale?: string;
  interaction?: {
    mode?: 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';
    intersect?: boolean;
    includeInvisible?: boolean;
  };
  hover?: {
    mode?: 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';
    intersect?: boolean;
    animationDuration?: number;
  };
  onClick?: (event: Event, elements: any[], chart: any) => void;
  onHover?: (event: Event, elements: any[], chart: any) => void;
  animation?: boolean | {
    duration?: number;
    easing?: string;
    delay?: number;
    loop?: boolean;
    onComplete?: (animation: any) => void;
    onProgress?: (animation: any) => void;
  };
  animations?: Record<string, any>;
  transitions?: Record<string, any>;
  layout?: {
    padding?: number | {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  scales?: Record<string, ChartAxis>;
  plugins?: {
    title?: {
      display?: boolean;
      text?: string | string[];
      color?: string;
      font?: ChartFont;
      position?: 'top' | 'bottom';
      align?: 'start' | 'center' | 'end';
      padding?: number;
    };
    subtitle?: {
      display?: boolean;
      text?: string | string[];
      color?: string;
      font?: ChartFont;
      position?: 'top' | 'bottom';
      align?: 'start' | 'center' | 'end';
      padding?: number;
    };
    legend?: ChartLegend;
    tooltip?: ChartTooltip;
    datalabels?: {
      display?: boolean | ((context: any) => boolean);
      align?: string | number;
      anchor?: string;
      backgroundColor?: string | ((context: any) => string);
      borderColor?: string | ((context: any) => string);
      borderRadius?: number;
      borderWidth?: number;
      clamp?: boolean;
      clip?: boolean;
      color?: string | ((context: any) => string);
      font?: ChartFont | ((context: any) => ChartFont);
      formatter?: (value: any, context: any) => string;
      labels?: Record<string, any>;
      listeners?: Record<string, (context: any) => boolean>;
      offset?: number;
      opacity?: number | ((context: any) => number);
      padding?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };
      rotation?: number | ((context: any) => number);
      textAlign?: 'start' | 'center' | 'end';
      textStrokeColor?: string | ((context: any) => string);
      textStrokeWidth?: number | ((context: any) => number);
      textShadowBlur?: number;
      textShadowColor?: string;
    };
    zoom?: {
      pan?: {
        enabled?: boolean;
        mode?: 'x' | 'y' | 'xy';
        threshold?: number;
        modifierKey?: 'ctrl' | 'alt' | 'shift' | 'meta';
      };
      zoom?: {
        wheel?: {
          enabled?: boolean;
          speed?: number;
          modifierKey?: 'ctrl' | 'alt' | 'shift' | 'meta';
        };
        pinch?: {
          enabled?: boolean;
        };
        mode?: 'x' | 'y' | 'xy';
      };
      limits?: {
        x?: { min?: number; max?: number; minRange?: number };
        y?: { min?: number; max?: number; minRange?: number };
      };
    };
    annotation?: {
      annotations?: ChartAnnotation[];
    };
  };
}

// Chart-specific props
export interface LineChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  smooth?: boolean;
  stepped?: boolean | 'before' | 'after' | 'middle';
  showPoints?: boolean;
  pointStyle?: string;
  fill?: boolean;
  stacked?: boolean;
}

export interface BarChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  horizontal?: boolean;
  stacked?: boolean;
  grouped?: boolean;
  barThickness?: number;
  maxBarThickness?: number;
  categoryPercentage?: number;
  barPercentage?: number;
}

export interface AreaChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  stacked?: boolean;
  smooth?: boolean;
  fillOpacity?: number;
}

export interface PieChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  showValues?: boolean;
  showPercentages?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}

export interface DonutChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  innerRadius?: number;
  outerRadius?: number;
  centerText?: string;
  showValues?: boolean;
  showPercentages?: boolean;
}

export interface ScatterPlotProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  showTrendline?: boolean;
  trendlineOptions?: {
    color?: string;
    width?: number;
    type?: 'linear' | 'polynomial' | 'exponential' | 'logarithmic';
  };
}

export interface RadarChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  fill?: boolean;
  pointStyle?: string;
  angleLines?: boolean;
  gridLines?: boolean;
}

export interface GaugeChartProps extends BaseChart {
  value: number;
  min?: number;
  max?: number;
  segments?: GaugeSegment[];
  showValue?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  needle?: boolean;
  size?: number;
  thickness?: number;
}

export interface GaugeSegment {
  min: number;
  max: number;
  color: string;
  label?: string;
}

export interface HeatmapChartProps extends BaseChart {
  data: HeatmapData[][];
  xLabels?: string[];
  yLabels?: string[];
  colorScale?: string[];
  showValues?: boolean;
  cellSize?: number;
  gap?: number;
}

export interface HeatmapData {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export interface TreemapProps extends BaseChart {
  data: TreemapNode[];
  colorBy?: 'value' | 'category' | 'custom';
  showLabels?: boolean;
  showValues?: boolean;
  nestingLevels?: number;
}

export interface TreemapNode {
  id: string;
  name: string;
  value: number;
  color?: string;
  category?: string;
  children?: TreemapNode[];
  metadata?: Record<string, any>;
}

export interface RealtimeChartProps extends BaseChart {
  data: ChartData;
  options?: ChartOptions;
  updateInterval?: number;
  maxDataPoints?: number;
  autoScroll?: boolean;
  pauseOnHover?: boolean;
  onDataUpdate?: (newData: ChartData) => void;
}

// Chart events
export interface ChartClickEvent {
  type: 'click';
  chart: any;
  native: Event;
  x: number;
  y: number;
  datasetIndex?: number;
  dataIndex?: number;
  element?: any;
}

export interface ChartHoverEvent {
  type: 'hover';
  chart: any;
  native: Event;
  x: number;
  y: number;
  datasetIndex?: number;
  dataIndex?: number;
  element?: any;
}

export interface ChartLegendEvent {
  type: 'legendClick';
  chart: any;
  native: Event;
  legendItem: any;
  datasetIndex: number;
}

// Chart annotations
export interface ChartAnnotation {
  id?: string;
  type: 'line' | 'box' | 'ellipse' | 'point' | 'polygon' | 'label';
  display?: boolean;
  adjustScaleRange?: boolean;
  scaleID?: string;
  value?: number;
  endValue?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  xValue?: number;
  yValue?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderDash?: number[];
  borderDashOffset?: number;
  borderRadius?: number;
  rotation?: number;
  xAdjust?: number;
  yAdjust?: number;
  label?: {
    enabled?: boolean;
    content?: string | string[];
    position?: string;
    xAdjust?: number;
    yAdjust?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    color?: string;
    font?: ChartFont;
    padding?: number;
    textAlign?: 'start' | 'center' | 'end';
  };
}

// Chart utilities and helpers
export interface ChartUtils {
  formatData: (data: any[], labelKey: string, valueKeys: string[]) => ChartData;
  generateColors: (count: number, scheme?: ColorScheme) => string[];
  exportChart: (chart: any, format: 'png' | 'jpg' | 'pdf' | 'svg') => void;
  downloadChart: (chart: any, filename: string, format: 'png' | 'jpg' | 'pdf' | 'svg') => void;
  printChart: (chart: any) => void;
  getChartImage: (chart: any, format: 'png' | 'jpg', quality?: number) => string;
  validateData: (data: ChartData) => boolean;
  mergeOptions: (defaultOptions: ChartOptions, userOptions: ChartOptions) => ChartOptions;
  calculateStats: (data: number[]) => {
    min: number;
    max: number;
    mean: number;
    median: number;
    mode: number;
    range: number;
    variance: number;
    standardDeviation: number;
  };
}

// Chart themes and styling
export interface ChartTheme {
  id: string;
  name: string;
  description?: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
  };
  background: {
    primary: string;
    secondary: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  grid: {
    primary: string;
    secondary: string;
  };
  fonts: {
    title: ChartFont;
    subtitle: ChartFont;
    body: ChartFont;
    caption: ChartFont;
  };
}

// Chart configuration presets
export interface ChartPreset {
  id: string;
  name: string;
  description?: string;
  type: ChartType;
  options: ChartOptions;
  sampleData?: ChartData;
  tags?: string[];
  category?: string;
}

// Chart performance and optimization
export interface ChartPerformanceOptions {
  enableOptimizations?: boolean;
  decimation?: {
    enabled?: boolean;
    algorithm?: 'lttb' | 'min-max';
    samples?: number;
    threshold?: number;
  };
  parsing?: {
    xAxisKey?: string;
    yAxisKey?: string;
  };
  normalized?: boolean;
  spanGaps?: boolean | number;
  indexAxis?: 'x' | 'y';
  clip?: boolean | number;
  drawActiveElementsOnTop?: boolean;
}

// Chart accessibility
export interface ChartAccessibilityOptions {
  enabled?: boolean;
  description?: string;
  announceNewData?: boolean;
  elementsHaveNoActions?: boolean;
  announceDataSeriesPosition?: boolean;
  announceDataSeriesName?: boolean;
  keyboardNavigation?: {
    enabled?: boolean;
    mode?: 'series' | 'point';
    seriesNavigation?: {
      enabled?: boolean;
      mode?: 'normal' | 'wrap';
      pointNavigationEnabledThreshold?: number;
    };
  };
}

// Chart export and sharing
export interface ChartExportOptions {
  formats?: ('png' | 'jpg' | 'pdf' | 'svg' | 'csv' | 'json')[];
  filename?: string;
  quality?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  scale?: number;
  includeData?: boolean;
  includeOptions?: boolean;
}