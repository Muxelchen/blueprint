import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealtimeData {
  time: string;
  value1: number;
  value2: number;
  value3: number;
}

interface RealtimeChartProps {
  title?: string;
  maxDataPoints?: number;
  updateInterval?: number;
  animate?: boolean;
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({ 
  title = 'Real-time Data Stream',
  maxDataPoints = 20,
  updateInterval = 1000,
  animate = true 
}) => {
  const [data, setData] = useState<RealtimeData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(updateInterval);
  const intervalRef = useRef<number | null>(null);

  const generateDataPoint = (): RealtimeData => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    // Generate realistic fluctuating data
    const baseValue1 = 50;
    const baseValue2 = 30;
    const baseValue3 = 70;
    
    return {
      time: timeString,
      value1: Math.max(0, Math.min(100, baseValue1 + (Math.random() - 0.5) * 30)),
      value2: Math.max(0, Math.min(100, baseValue2 + (Math.random() - 0.5) * 25)),
      value3: Math.max(0, Math.min(100, baseValue3 + (Math.random() - 0.5) * 20))
    };
  };

  useEffect(() => {
    // Initialize with some data points
    const initialData: RealtimeData[] = [];
    for (let i = 0; i < 5; i++) {
      initialData.push(generateDataPoint());
    }
    setData(initialData);
  }, []);

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isRunning) {
      // Restart with new speed
      setIsRunning(false);
      setTimeout(() => setIsRunning(true), 100);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setData(prevData => {
          const newData = [...prevData, generateDataPoint()];
          return newData.slice(-maxDataPoints);
        });
      }, speed);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, maxDataPoints]);

  const togglePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const clearData = () => {
    setData([]);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Time: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <span style={{ color: pld.color }} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: pld.color }}></span>
                {pld.dataKey}:
              </span>
              <span className="font-bold ml-2">{pld.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getLatestValues = () => {
    if (data.length === 0) return { value1: 0, value2: 0, value3: 0 };
    const latest = data[data.length - 1];
    return {
      value1: latest.value1,
      value2: latest.value2,
      value3: latest.value3
    };
  };

  const getAverages = () => {
    if (data.length === 0) return { value1: 0, value2: 0, value3: 0 };
    
    const sums = data.reduce((acc, curr) => ({
      value1: acc.value1 + curr.value1,
      value2: acc.value2 + curr.value2,
      value3: acc.value3 + curr.value3
    }), { value1: 0, value2: 0, value3: 0 });
    
    return {
      value1: sums.value1 / data.length,
      value2: sums.value2 / data.length,
      value3: sums.value3 / data.length
    };
  };

  const latest = getLatestValues();
  const averages = getAverages();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isRunning ? 'Live' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayPause}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isRunning 
                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={clearData}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            🗑 Clear
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Speed:</span>
          {[500, 1000, 2000, 5000].map((speedOption) => (
            <button
              key={speedOption}
              onClick={() => changeSpeed(speedOption)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                speed === speedOption 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {speedOption === 500 ? '2x' : speedOption === 1000 ? '1x' : speedOption === 2000 ? '0.5x' : '0.2x'}
            </button>
          ))}
        </div>
      </div>

      {/* Current values display */}
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

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#3B82F6"
              strokeWidth={2}
              name="CPU Usage"
              dot={false}
              activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
              animationDuration={animate ? 200 : 0}
            />
            
            <Line 
              type="monotone" 
              dataKey="value2" 
              stroke="#10B981"
              strokeWidth={2}
              name="Memory"
              dot={false}
              activeDot={{ r: 4, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
              animationDuration={animate ? 200 : 0}
            />
            
            <Line 
              type="monotone" 
              dataKey="value3" 
              stroke="#F59E0B"
              strokeWidth={2}
              name="Network"
              dot={false}
              activeDot={{ r: 4, stroke: '#F59E0B', strokeWidth: 2, fill: '#ffffff' }}
              animationDuration={animate ? 200 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status and info */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Data points: {data.length}/{maxDataPoints} • Update interval: {updateInterval}ms
        </div>
        <div>
          {data.length > 0 && `Last update: ${data[data.length - 1]?.time}`}
        </div>
      </div>

      {/* Alert system */}
      {latest.value1 > 80 || latest.value2 > 80 || latest.value3 > 80 ? (
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
      ) : null}
    </div>
  );
};

export default RealtimeChart;