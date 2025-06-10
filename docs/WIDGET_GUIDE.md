# 🚀 Blueprint Widget Development Guide

**Complete guide for creating, optimizing, and managing widgets in the Blueprint ecosystem.**

Blueprint's widget system provides a comprehensive framework for building interactive, performant, and accessible data visualization components. With 17 production-ready widgets and advanced development tools, you can create custom widgets that integrate seamlessly with the Blueprint ecosystem.

## 📊 Available Widget Categories

### Chart Widgets (10 Components)
```tsx
// Interactive data visualization widgets
import { 
  AreaChart, BarChart, LineChart, PieChart, DonutChart,
  GaugeChart, RealtimeChart, Heatmap, ScatterPlot, Treemap
} from '@/components/widgets';

// All widgets support:
// ✅ Real-time data updates
// ✅ Export functionality (PNG, PDF, SVG)
// ✅ Responsive design
// ✅ Theme integration
// ✅ Accessibility compliance
// ✅ Performance optimization
```

### Data Display Widgets (4 Components)
```tsx
// Information and metrics widgets
import { 
  KPICard, DataTable, Timeline, ProgressBar
} from '@/components/widgets';

// Advanced features:
// ✅ Virtual scrolling for large datasets
// ✅ Real-time updates
// ✅ Export capabilities
// ✅ Search and filtering
// ✅ Accessibility support
```

### Interactive Widgets (3 Components)
```tsx
// User interaction and utility widgets
import { 
  Calendar, WeatherWidget, InteractiveMap
} from '@/components/widgets';

// Specialized features:
// ✅ Event handling and callbacks
// ✅ Third-party API integration
// ✅ Touch/gesture support
// ✅ Geolocation capabilities
```

## 🎯 Widget Development Framework

### 1. Widget Architecture
```tsx
// Standard widget structure
interface WidgetProps {
  // Core properties
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  
  // Data properties
  data?: any[];
  loading?: boolean;
  error?: string;
  
  // Display properties
  title?: string;
  height?: number | string;
  width?: number | string;
  theme?: 'light' | 'dark' | 'auto';
  
  // Interaction properties
  onRefresh?: () => void;
  onExport?: (format: string) => void;
  onClick?: (data: any) => void;
  
  // Performance properties
  virtualScrolling?: boolean;
  lazyLoading?: boolean;
  cacheEnabled?: boolean;
}

// Base widget component
const BaseWidget: React.FC<WidgetProps> = ({
  id,
  className = '',
  data = [],
  loading = false,
  error,
  title,
  height = 300,
  theme = 'auto',
  onRefresh,
  onExport,
  children,
  ...props
}) => {
  // Widget implementation
  return (
    <div 
      id={id}
      className={`widget-container ${className}`}
      style={{ height }}
      {...props}
    >
      {title && (
        <div className="widget-header">
          <h3>{title}</h3>
          {onRefresh && (
            <button onClick={onRefresh} aria-label="Refresh widget">
              <RefreshIcon />
            </button>
          )}
          {onExport && (
            <ExportMenu onExport={onExport} />
          )}
        </div>
      )}
      
      <div className="widget-content">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={onRefresh} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
```

### 2. Creating Custom Widgets
```tsx
// Step 1: Define your widget interface
interface CustomChartWidgetProps extends WidgetProps {
  chartType: 'line' | 'bar' | 'area';
  showLegend?: boolean;
  enableZoom?: boolean;
  animations?: boolean;
}

// Step 2: Implement the widget
const CustomChartWidget: React.FC<CustomChartWidgetProps> = ({
  data = [],
  chartType = 'line',
  showLegend = true,
  enableZoom = false,
  animations = true,
  ...baseProps
}) => {
  // Performance optimization with useMemo
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      value: typeof item.value === 'string' ? parseFloat(item.value) : item.value
    }));
  }, [data]);

  // Chart configuration
  const chartConfig = useMemo(() => ({
    type: chartType,
    data: processedData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: showLegend },
        zoom: enableZoom ? { enabled: true } : undefined
      },
      animation: animations
    }
  }), [chartType, processedData, showLegend, enableZoom, animations]);

  return (
    <BaseWidget {...baseProps}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart config={chartConfig} />
      </ResponsiveContainer>
    </BaseWidget>
  );
};

// Step 3: Register with the component registry
ComponentRegistry.register('CustomChartWidget', CustomChartWidget, 'widgets', {
  description: 'Custom chart widget with advanced features',
  version: '1.0.0',
  dependencies: ['recharts'],
  preload: false,
  priority: 'medium'
});
```

### 3. Advanced Widget Features

#### Real-time Data Integration
```tsx
// Real-time widget with WebSocket integration
const RealtimeWidget: React.FC<RealtimeWidgetProps> = ({
  endpoint,
  updateInterval = 5000,
  maxDataPoints = 100,
  ...props
}) => {
  const [data, setData] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  // WebSocket connection
  const { 
    data: realtimeData, 
    connected: wsConnected,
    error: wsError 
  } = useWebSocket(endpoint, {
    onMessage: (message) => {
      setData(prev => {
        const newData = [...prev, JSON.parse(message.data)];
        return newData.slice(-maxDataPoints); // Keep only recent data
      });
    },
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });

  // Fallback polling for non-WebSocket environments
  useEffect(() => {
    if (!wsConnected) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(endpoint);
          const newData = await response.json();
          setData(prev => [...prev, newData].slice(-maxDataPoints));
        } catch (error) {
          console.error('Failed to fetch real-time data:', error);
        }
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [wsConnected, endpoint, updateInterval, maxDataPoints]);

  return (
    <BaseWidget 
      {...props}
      loading={!connected}
      error={wsError?.message}
    >
      <RealtimeChart 
        data={data}
        streaming={true}
        bufferSize={maxDataPoints}
      />
      <div className="connection-status">
        <StatusIndicator 
          status={wsConnected ? 'online' : 'offline'} 
          label={wsConnected ? 'Live' : 'Offline'}
        />
      </div>
    </BaseWidget>
  );
};
```

#### Export Functionality
```tsx
// Advanced export capabilities
const ExportableWidget: React.FC<ExportableWidgetProps> = ({ 
  data, 
  title,
  exportFormats = ['png', 'pdf', 'csv', 'excel'],
  ...props 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async (format: string) => {
    switch (format) {
      case 'png':
        if (chartRef.current) {
          const canvas = await html2canvas(chartRef.current);
          const link = document.createElement('a');
          link.download = `${title || 'widget'}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
        break;

      case 'pdf':
        // PDF export implementation
        const pdf = new jsPDF();
        if (chartRef.current) {
          const canvas = await html2canvas(chartRef.current);
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
          pdf.save(`${title || 'widget'}.pdf`);
        }
        break;

      case 'csv':
        // CSV export implementation
        const csvContent = data.map(row => 
          Object.values(row).join(',')
        ).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title || 'widget'}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        break;

      case 'excel':
        // Excel export using ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        
        // Add headers
        if (data.length > 0) {
          worksheet.addRow(Object.keys(data[0]));
          // Add data rows
          data.forEach(row => {
            worksheet.addRow(Object.values(row));
          });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title || 'widget'}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
        break;
    }
  }, [data, title]);

  return (
    <BaseWidget 
      {...props}
      onExport={handleExport}
    >
      <div ref={chartRef}>
        {/* Widget content */}
      </div>
    </BaseWidget>
  );
};
```

### 4. Performance Optimization

#### Virtual Scrolling for Large Datasets
```tsx
// High-performance data table widget
const VirtualizedDataWidget: React.FC<VirtualizedDataWidgetProps> = ({
  data = [],
  rowHeight = 50,
  overscan = 5,
  searchable = true,
  sortable = true,
  ...props
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data]);

  // Sorting functionality
  const handleSort = useCallback((key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
    setSortConfig({ key, direction });
  }, [filteredData, sortConfig]);

  return (
    <BaseWidget {...props}>
      {searchable && (
        <SearchBar 
          placeholder="Search data..."
          onSearch={handleSearch}
          debounceMs={300}
        />
      )}
      
      <FixedSizeList
        height={400}
        itemCount={filteredData.length}
        itemSize={rowHeight}
        overscanCount={overscan}
        itemData={{ data: filteredData, onSort: handleSort, sortable }}
      >
        {({ index, style, data: listData }) => (
          <div style={style}>
            <DataRow 
              item={listData.data[index]}
              onSort={listData.onSort}
              sortable={listData.sortable}
            />
          </div>
        )}
      </FixedSizeList>
    </BaseWidget>
  );
};
```

#### Memory Management
```tsx
// Memory-efficient widget with cleanup
const OptimizedWidget: React.FC<OptimizedWidgetProps> = ({ 
  data,
  enableAutoCleanup = true,
  maxCacheSize = 1000,
  ...props 
}) => {
  const [cache, setCache] = useState(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for visibility optimization
  useEffect(() => {
    if (!widgetRef.current || !enableAutoCleanup) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(widgetRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableAutoCleanup]);

  // Cache management
  useEffect(() => {
    if (cache.size > maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
  }, [cache, maxCacheSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCache(new Map());
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div ref={widgetRef}>
      <BaseWidget {...props}>
        {isVisible && (
          // Only render content when visible
          <WidgetContent data={data} cache={cache} />
        )}
      </BaseWidget>
    </div>
  );
};
```

## 🎨 Widget Styling & Theming

### 1. Theme Integration
```tsx
// Theme-aware widget
const ThemedWidget: React.FC<ThemedWidgetProps> = ({ ...props }) => {
  const { theme, colors } = useTheme();

  const widgetStyles = useMemo(() => ({
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    color: colors.text.primary
  }), [colors]);

  const chartColors = useMemo(() => ({
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500]
  }), [colors]);

  return (
    <BaseWidget 
      {...props}
      style={widgetStyles}
      className={`widget-themed widget-${theme}`}
    >
      <Chart 
        data={props.data}
        colors={chartColors}
        theme={theme}
      />
    </BaseWidget>
  );
};
```

### 2. Responsive Design
```tsx
// Responsive widget with breakpoint handling
const ResponsiveWidget: React.FC<ResponsiveWidgetProps> = ({
  breakpoints = { sm: 576, md: 768, lg: 992, xl: 1200 },
  ...props
}) => {
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setScreenSize('sm');
      else if (width < breakpoints.md) setScreenSize('md');
      else if (width < breakpoints.lg) setScreenSize('lg');
      else setScreenSize('xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  const responsiveConfig = useMemo(() => {
    switch (screenSize) {
      case 'sm':
        return { height: 200, showLegend: false, fontSize: 12 };
      case 'md':
        return { height: 250, showLegend: true, fontSize: 14 };
      case 'lg':
        return { height: 300, showLegend: true, fontSize: 16 };
      case 'xl':
        return { height: 400, showLegend: true, fontSize: 16 };
      default:
        return { height: 300, showLegend: true, fontSize: 16 };
    }
  }, [screenSize]);

  return (
    <BaseWidget 
      {...props}
      height={responsiveConfig.height}
      className={`widget-responsive widget-${screenSize}`}
    >
      <Chart 
        {...responsiveConfig}
        data={props.data}
      />
    </BaseWidget>
  );
};
```

## 🔧 Widget Development Tools

### 1. CLI Generator
```bash
# Generate new widget using CLI
npm run cli generate widget MyCustomWidget --type chart

# Generate with specific features
npm run cli generate widget RealtimeWidget --type realtime --features websocket,export

# Generate widget with tests
npm run cli generate widget AnalyticsWidget --type analytics --with-tests
```

### 2. Development Commands
```bash
# Widget-specific development commands
npm run dev:widgets          # Start widget development server
npm run test:widgets         # Run widget-specific tests
npm run build:widgets        # Build widgets for production
npm run analyze:widgets      # Analyze widget bundle sizes
npm run docs:widgets         # Generate widget documentation
```

### 3. Widget Testing
```tsx
// Comprehensive widget testing
describe('CustomWidget', () => {
  it('renders correctly with data', () => {
    render(<CustomWidget data={mockData} />);
    expect(screen.getByTestId('widget-container')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<CustomWidget loading={true} />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<CustomWidget error="Failed to load data" />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('exports data correctly', async () => {
    const mockExport = jest.fn();
    render(<CustomWidget data={mockData} onExport={mockExport} />);
    
    fireEvent.click(screen.getByLabelText('Export'));
    fireEvent.click(screen.getByText('Export as CSV'));
    
    expect(mockExport).toHaveBeenCalledWith('csv');
  });

  it('handles real-time updates', async () => {
    const { rerender } = render(<CustomWidget data={[]} />);
    
    rerender(<CustomWidget data={[{ x: 1, y: 10 }]} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('chart-data')).toHaveTextContent('10');
    });
  });
});
```

## 📊 Widget Performance Monitoring

### 1. Performance Metrics
```tsx
// Widget performance monitoring
const PerformanceMonitoredWidget: React.FC<WidgetProps> = (props) => {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      trackPerformance('widget_render_time', {
        widgetType: props.type,
        duration: endTime - startTime,
        dataSize: props.data?.length || 0
      });
    };
  }, []);

  // Performance monitoring for updates
  useEffect(() => {
    if (props.data) {
      trackPerformance('widget_data_update', {
        widgetType: props.type,
        dataSize: props.data.length,
        timestamp: Date.now()
      });
    }
  }, [props.data]);

  return <BaseWidget {...props} />;
};
```

### 2. Bundle Analysis
```bash
# Analyze widget bundle sizes
npm run analyze:widgets

# Output example:
# Widget Bundle Analysis:
# - AreaChart: 45.2 KB (gzipped: 12.8 KB)
# - DataTable: 67.8 KB (gzipped: 18.3 KB)
# - KPICard: 23.1 KB (gzipped: 7.2 KB)
# Total Widget Bundle: 892.4 KB (gzipped: 234.7 KB)
```

## 🎯 Best Practices

### 1. Widget Development Guidelines
- **Consistent API**: Follow the standard widget interface
- **Performance First**: Implement virtual scrolling for large datasets
- **Accessibility**: Ensure WCAG 2.1 compliance
- **Responsive**: Design for all screen sizes
- **Themeable**: Support light/dark themes
- **Testable**: Write comprehensive unit tests
- **Documented**: Provide clear documentation and examples

### 2. Code Quality Standards
```tsx
// Example: Well-structured widget
const ExampleWidget: React.FC<ExampleWidgetProps> = ({
  // Destructure props with defaults
  data = [],
  loading = false,
  error,
  title,
  height = 300,
  onRefresh,
  className = '',
  ...restProps
}) => {
  // Performance optimization
  const processedData = useMemo(() => 
    data.filter(item => item.value != null), 
    [data]
  );

  // Error boundary
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRefresh} />;
  }

  return (
    <BaseWidget 
      className={`example-widget ${className}`}
      title={title}
      loading={loading}
      onRefresh={onRefresh}
      height={height}
      {...restProps}
    >
      <Chart data={processedData} />
    </BaseWidget>
  );
};

// TypeScript interface
interface ExampleWidgetProps extends WidgetProps {
  data?: DataPoint[];
  onRefresh?: () => void;
}

// Default export with display name
ExampleWidget.displayName = 'ExampleWidget';
export default ExampleWidget;
```

## 🔮 Advanced Widget Patterns

### 1. Composite Widgets
```tsx
// Complex widget composed of multiple sub-widgets
const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  kpiData,
  chartData,
  tableData,
  layout = 'default'
}) => {
  return (
    <div className={`dashboard-widget layout-${layout}`}>
      <div className="kpi-section">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
      
      <div className="chart-section">
        <AreaChart data={chartData} height={250} />
      </div>
      
      <div className="table-section">
        <DataTable 
          data={tableData}
          pagination={true}
          searchable={true}
        />
      </div>
    </div>
  );
};
```

### 2. Widget Communication
```tsx
// Inter-widget communication using context
const WidgetContext = createContext<{
  selectedData: any;
  setSelectedData: (data: any) => void;
}>({
  selectedData: null,
  setSelectedData: () => {}
});

const InteractiveWidget: React.FC<InteractiveWidgetProps> = ({ data }) => {
  const { setSelectedData } = useContext(WidgetContext);

  const handleDataClick = (dataPoint: any) => {
    setSelectedData(dataPoint);
  };

  return (
    <BaseWidget>
      <Chart 
        data={data}
        onDataClick={handleDataClick}
      />
    </BaseWidget>
  );
};

const DependentWidget: React.FC<DependentWidgetProps> = () => {
  const { selectedData } = useContext(WidgetContext);

  return (
    <BaseWidget>
      <DetailView data={selectedData} />
    </BaseWidget>
  );
};
```

## 🎉 Widget Ecosystem Success

**Current Widget Statistics (June 2025):**

✅ **17 Production Widgets** - Fully implemented and tested  
✅ **Advanced Features** - Real-time, export, theming, accessibility  
✅ **Performance Optimized** - Virtual scrolling, lazy loading, caching  
✅ **Developer Tools** - CLI generator, testing utilities, documentation  
✅ **Responsive Design** - Mobile-first, adaptive layouts  
✅ **Type Safety** - Full TypeScript support with strict mode  

---

**Ready for Widget Development** 🚀

Use `npm run dev` to explore all widgets, then `npm run cli generate widget` to create your custom widgets. The Blueprint widget system provides everything you need for building enterprise-grade data visualization components.