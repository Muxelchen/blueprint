import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useWebSocket from '../../hooks/useWebSocket';
import { useDebounceCallback } from '../../hooks/useDebounce';
import {
  usePerformanceOptimization,
  useChartOptimization,
} from '../../hooks/usePerformanceOptimization';

interface RealtimeData {
  timestamp: string;
  value1: number;
  value2: number;
  value3: number;
}

interface RealtimeChartProps {
  title?: string;
  maxDataPoints?: number;
  updateInterval?: number;
  animate?: boolean;
  websocketUrl?: string;
  websocketChannel?: string;
  dataType?: string;
  useMockServer?: boolean;
  height?: number | string;
  className?: string;
}

// 🚀 Optimized Memoized Components
const MemoizedTooltip = memo(({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold mb-2">{`Time: ${label}`}</p>
      {payload.map((pld: any, index: number) => (
        <div key={index} className="flex items-center justify-between mb-1">
          <span style={{ color: pld.color }} className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: pld.color }}
            ></span>
            {pld.dataKey}:
          </span>
          <span className="font-bold ml-2">{pld.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
});

const MemoizedCurrentValues = memo(
  ({
    latest,
    averages,
  }: {
    latest: { value1: number; value2: number; value3: number };
    averages: { value1: number; value2: number; value3: number };
  }) => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">CPU Usage</span>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="text-2xl font-bold text-blue-900">{latest.value1.toFixed(1)}%</div>
        <div className="text-xs text-blue-600">Avg: {averages.value1.toFixed(1)}%</div>
      </div>

      <div className="bg-green-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">Memory</span>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-2xl font-bold text-green-900">{latest.value2.toFixed(1)}%</div>
        <div className="text-xs text-green-600">Avg: {averages.value2.toFixed(1)}%</div>
      </div>

      <div className="bg-orange-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-orange-800">Network</span>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        </div>
        <div className="text-2xl font-bold text-orange-900">{latest.value3.toFixed(1)}%</div>
        <div className="text-xs text-orange-600">Avg: {averages.value3.toFixed(1)}%</div>
      </div>
    </div>
  )
);

const MemoizedAlerts = memo(
  ({ latest }: { latest: { value1: number; value2: number; value3: number } }) => {
    const hasHighUsage = latest.value1 > 80 || latest.value2 > 80 || latest.value3 > 80;

    if (!hasHighUsage) return null;

    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"></div>
          <div>
            <p className="font-medium text-red-800">High Usage Alert</p>
            <p className="text-sm text-red-600">
              {latest.value1 > 80 && 'CPU usage is high. '}
              {latest.value2 > 80 && 'Memory usage is high. '}
              {latest.value3 > 80 && 'Network usage is high. '}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

const RealtimeChart: React.FC<RealtimeChartProps> = ({
  title = 'Real-time Data Stream',
  maxDataPoints = 20,
  updateInterval = 1000,
  animate = true,
  websocketUrl = 'wss://api.example.com/ws',
  websocketChannel = 'system-metrics',
  dataType = 'SYSTEM_METRICS',
  useMockServer = true,
  height = 480,
  className = '',
}) => {
  // 🎯 Performance Optimizations
  const { useVisibilityOptimization, useRenderOptimization, useMemoryOptimization } =
    usePerformanceOptimization();
  const [chartRef, isVisible] = useVisibilityOptimization(0.1);
  const { startMeasure, endMeasure, metrics } = useRenderOptimization('RealtimeChart');
  const { checkMemoryUsage, clearCache } = useMemoryOptimization();

  const [data, setData] = useState<RealtimeData[]>([]);
  const [useWebsocketData, setUseWebsocketData] = useState(false);
  const [speed, setSpeed] = useState(updateInterval);
  const [isRunning, setIsRunning] = useState(true);

  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dataGenerationRef = useRef<boolean>(true);

  // 📊 Optimized data with chart optimization hook
  const { optimizedData, statistics } = useChartOptimization(data, maxDataPoints);

  // 📈 Memoized calculations
  const latest = useMemo(() => {
    if (!optimizedData.length) return { value1: 0, value2: 0, value3: 0 };
    return optimizedData[optimizedData.length - 1];
  }, [optimizedData]);

  const averages = useMemo(() => {
    if (!optimizedData.length) return { value1: 0, value2: 0, value3: 0 };

    const sums = optimizedData.reduce(
      (acc, item) => ({
        value1: acc.value1 + item.value1,
        value2: acc.value2 + item.value2,
        value3: acc.value3 + item.value3,
      }),
      { value1: 0, value2: 0, value3: 0 }
    );

    const count = optimizedData.length;
    return {
      value1: sums.value1 / count,
      value2: sums.value2 / count,
      value3: sums.value3 / count,
    };
  }, [optimizedData]);

  // 🔄 Optimized data generation
  const generateMockData = useCallback((): RealtimeData => {
    const now = new Date();
    return {
      timestamp: now.toLocaleTimeString(),
      value1: Math.random() * 100,
      value2: Math.random() * 100,
      value3: Math.random() * 100,
    };
  }, []);

  // 🚀 Debounced data updates for better performance
  const debouncedAddData = useDebounceCallback((newData: RealtimeData) => {
    setData(prevData => {
      const updatedData = [...prevData, newData];
      return updatedData.slice(-maxDataPoints);
    });
  }, 50);

  // 🌐 WebSocket integration
  const { connected: isConnected, send: sendMessage } = useWebSocket({
    url: useWebsocketData ? websocketUrl : '',
    autoConnect: useWebsocketData,
    onMessage: (data: any) => {
      if (data.type === dataType) {
        debouncedAddData(data.payload);
      }
    },
    onOpen: () => {
      sendMessage('subscribe', {
        channel: websocketChannel,
      });
    },
  });

  // 🔄 Mock data generation with performance monitoring
  useEffect(() => {
    if (!useWebsocketData && isRunning && isVisible && dataGenerationRef.current) {
      startMeasure();

      intervalRef.current = setInterval(() => {
        // Check memory usage periodically
        const memoryUsage = checkMemoryUsage();
        if (memoryUsage > 90) {
          console.warn('🧠 High memory usage in RealtimeChart, clearing old data');
          setData(prev => prev.slice(-Math.floor(maxDataPoints / 2)));
          clearCache();
        }

        const newData = generateMockData();
        debouncedAddData(newData);
      }, speed);

      endMeasure();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [
    useWebsocketData,
    isRunning,
    speed,
    isVisible,
    generateMockData,
    debouncedAddData,
    maxDataPoints,
    startMeasure,
    endMeasure,
    checkMemoryUsage,
    clearCache,
  ]);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      dataGenerationRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 🎛️ Control handlers
  const togglePlayback = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const changeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const toggleDataSource = useCallback(() => {
    setUseWebsocketData(prev => !prev);
    setData([]); // Clear data when switching sources
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    clearCache();
  }, [clearCache]);

  // 🎨 Don't render if not visible (performance optimization)
  if (!isVisible) {
    return <div ref={chartRef} style={{ height: typeof height === 'number' ? `${height}px` : height }} className={className} />;
  }

  const containerHeight = typeof height === 'number' ? `${height}px` : height;
  const chartHeight = typeof height === 'number' ? Math.max(200, height - 280) : '200px'; // Reserve space for controls and stats

  return (
    <div 
      ref={chartRef} 
      className={`p-4 bg-white rounded-lg shadow-lg flex flex-col ${className}`}
      style={{ height: containerHeight, minHeight: '400px' }}
    >
      {/* Header with performance metrics */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <span>
              📊 Data Points: {optimizedData.length}/{maxDataPoints}
            </span>
            {metrics && <span>⚡ Render: {metrics.renderTime.toFixed(1)}ms</span>}
            <span
              className={`flex items-center ${isConnected ? 'text-green-600' : 'text-gray-400'}`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
              ></div>
              {useWebsocketData ? (isConnected ? 'Connected' : 'Disconnected') : 'Mock Data'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Values */}
      <div className="flex-shrink-0 mb-3">
        <MemoizedCurrentValues latest={latest} averages={averages} />
      </div>

      {/* Chart - Takes remaining space */}
      <div className="flex-1 mb-3 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={optimizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip content={<MemoizedTooltip />} />
            <Line
              type="monotone"
              dataKey="value1"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={animate && optimizedData.length < 50} // Disable animation for large datasets
            />
            <Line
              type="monotone"
              dataKey="value2"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              isAnimationActive={animate && optimizedData.length < 50}
            />
            <Line
              type="monotone"
              dataKey="value3"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              isAnimationActive={animate && optimizedData.length < 50}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="flex-shrink-0">
        <MemoizedAlerts latest={latest} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayback}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isRunning
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {isRunning ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={clearData}
            className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>

          <button
            onClick={toggleDataSource}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              useWebsocketData ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {useWebsocketData ? 'WebSocket' : 'Simulated'}
          </button>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Speed:</span>
          {[500, 1000, 2000, 5000].map(speedOption => (
            <button
              key={speedOption}
              onClick={() => changeSpeed(speedOption)}
              disabled={useWebsocketData}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                speed === speedOption
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${useWebsocketData ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {speedOption === 500
                ? '2x'
                : speedOption === 1000
                  ? '1x'
                  : speedOption === 2000
                    ? '0.5x'
                    : '0.2x'}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Statistics */}
      {statistics && (
        <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600 flex-shrink-0">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Avg Values:</span>
              <div>CPU: {statistics.value1?.avg.toFixed(1)}%</div>
              <div>Memory: {statistics.value2?.avg.toFixed(1)}%</div>
              <div>Network: {statistics.value3?.avg.toFixed(1)}%</div>
            </div>
            <div>
              <span className="font-medium">Peak Values:</span>
              <div>CPU: {statistics.value1?.max.toFixed(1)}%</div>
              <div>Memory: {statistics.value2?.max.toFixed(1)}%</div>
              <div>Network: {statistics.value3?.max.toFixed(1)}%</div>
            </div>
            <div>
              <span className="font-medium">Performance:</span>
              {metrics && <div>Render: {metrics.renderTime.toFixed(1)}ms</div>}
              {metrics && <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>}
              <div>Data Points: {optimizedData.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RealtimeChart);
