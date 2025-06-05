// Widget-specific types and interfaces
import { BaseComponent, ComponentSize } from './index';
import type { ChartData, ChartOptions } from './charts';

// KPI Data structure for mock data
export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  color?: string;
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

// Re-export chart types for widgets
export type { TreemapNode, TreemapProps, RealtimeChartProps } from './charts';