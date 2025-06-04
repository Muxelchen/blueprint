import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Palette
} from 'lucide-react';

export interface HeatmapPoint {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  value?: number;
  timestamp?: Date;
  category?: string;
  metadata?: Record<string, any>;
}

export interface HeatmapOverlayProps {
  points?: HeatmapPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
  minOpacity?: number;
  maxOpacity?: number;
  gradient?: Record<number, string>;
  showControls?: boolean;
  showLegend?: boolean;
  showAnimation?: boolean;
  animationSpeed?: number;
  className?: string;
  onIntensityChange?: (intensity: number) => void;
  onPointClick?: (point: HeatmapPoint) => void;
}

// Mock heatmap data for different categories
const generateMockHeatmapData = (): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];
  const categories = ['traffic', 'sales', 'population', 'temperature', 'wifi'];
  const baseLocations = [
    { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
    { lat: 40.7128, lng: -74.0060, city: 'New York' },
    { lat: 34.0522, lng: -118.2437, city: 'Los Angeles' },
    { lat: 41.8781, lng: -87.6298, city: 'Chicago' },
    { lat: 25.7617, lng: -80.1918, city: 'Miami' },
    { lat: 47.6062, lng: -122.3321, city: 'Seattle' },
    { lat: 39.7392, lng: -104.9903, city: 'Denver' },
    { lat: 30.2672, lng: -97.7431, city: 'Austin' }
  ];

  let pointId = 1;

  baseLocations.forEach((location, locationIndex) => {
    // Generate multiple points around each city
    for (let i = 0; i < 50; i++) {
      // Create clusters around the main location
      const angle = (Math.PI * 2 * i) / 50;
      const distance = Math.random() * 0.1; // Within ~10km radius
      const lat = location.lat + Math.cos(angle) * distance;
      const lng = location.lng + Math.sin(angle) * distance;

      const category = categories[Math.floor(Math.random() * categories.length)];
      const baseIntensity = Math.random();
      
      // Add some clustering effects
      const clusterFactor = Math.exp(-Math.pow(distance * 20, 2));
      const intensity = Math.min(1, baseIntensity + clusterFactor * 0.5);

      // Generate time-based data for animation
      const hoursBack = Math.floor(Math.random() * 24);
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - hoursBack);

      points.push({
        id: `point_${pointId++}`,
        lat,
        lng,
        intensity,
        value: Math.floor(intensity * 100),
        timestamp,
        category,
        metadata: {
          city: location.city,
          cluster: Math.floor(i / 10),
          source: `sensor_${locationIndex}_${i}`,
          confidence: 0.7 + Math.random() * 0.3
        }
      });
    }
  });

  return points;
};

// Color gradients for different heatmap styles
const gradients = {
  classic: {
    0.0: '#000428',
    0.2: '#004e92',
    0.4: '#009ffd',
    0.6: '#00d2ff',
    0.8: '#ffffff',
    1.0: '#ffffff'
  },
  heat: {
    0.0: '#0000ff',
    0.2: '#00ff00',
    0.4: '#ffff00',
    0.6: '#ff8000',
    0.8: '#ff0000',
    1.0: '#ffffff'
  },
  viridis: {
    0.0: '#440154',
    0.2: '#31688e',
    0.4: '#35b779',
    0.6: '#8fd744',
    0.8: '#fde725',
    1.0: '#ffffff'
  },
  plasma: {
    0.0: '#0d0887',
    0.2: '#7e03a8',
    0.4: '#cc4778',
    0.6: '#f89441',
    0.8: '#feca57',
    1.0: '#f0f921'
  },
  cool: {
    0.0: '#00ffff',
    0.2: '#0080ff',
    0.4: '#8000ff',
    0.6: '#ff00ff',
    0.8: '#ff0080',
    1.0: '#ff0000'
  }
};

// Heatmap controls component
const HeatmapControls: React.FC<{
  radius: number;
  blur: number;
  opacity: number;
  gradient: string;
  isAnimating: boolean;
  animationSpeed: number;
  onRadiusChange: (radius: number) => void;
  onBlurChange: (blur: number) => void;
  onOpacityChange: (opacity: number) => void;
  onGradientChange: (gradient: string) => void;
  onToggleAnimation: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onExport: () => void;
}> = ({
  radius,
  blur,
  opacity,
  gradient,
  isAnimating,
  animationSpeed,
  onRadiusChange,
  onBlurChange,
  onOpacityChange,
  onGradientChange,
  onToggleAnimation,
  onSpeedChange,
  onReset,
  onExport
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-red-500" />
          <span className="font-medium text-sm">Heatmap</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Controls */}
      <div className="p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleAnimation}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              isAnimating 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAnimating ? 'Pause' : 'Play'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Reset settings"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          
          <button
            onClick={onExport}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Export data"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>

        {/* Intensity indicator */}
        <div className="flex items-center space-x-2 text-xs">
          <Activity className="w-3 h-3 text-blue-500" />
          <span className="text-gray-600">Intensity:</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-300"
              style={{ width: `${opacity * 100}%` }}
            />
          </div>
          <span className="font-medium">{Math.round(opacity * 100)}%</span>
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 space-y-3">
          {/* Radius Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Radius: {radius}px
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={radius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Blur Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Blur: {blur}px
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={blur}
              onChange={(e) => onBlurChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Opacity Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Animation Speed */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Speed: {animationSpeed}ms
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={animationSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Gradient Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Color Scheme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(gradients).map((gradientName) => (
                <button
                  key={gradientName}
                  onClick={() => onGradientChange(gradientName)}
                  className={`relative h-8 rounded border-2 transition-all ${
                    gradient === gradientName 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${Object.values(gradients[gradientName as keyof typeof gradients]).join(', ')})`
                  }}
                  title={gradientName}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
                    {gradientName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Heatmap legend component
const HeatmapLegend: React.FC<{
  gradient: Record<number, string>;
  minValue: number;
  maxValue: number;
  unit?: string;
}> = ({ gradient, minValue, maxValue, unit = '' }) => {
  const gradientStops = Object.entries(gradient)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([stop, color]) => `${color} ${Number(stop) * 100}%`)
    .join(', ');

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <Palette className="w-4 h-4 mr-2" />
        Intensity Scale
      </h4>
      
      <div className="flex items-center space-x-3">
        <span className="text-xs text-gray-500 font-medium">
          {minValue}{unit}
        </span>
        
        <div 
          className="w-32 h-4 rounded border border-gray-300"
          style={{
            background: `linear-gradient(to right, ${gradientStops})`
          }}
        />
        
        <span className="text-xs text-gray-500 font-medium">
          {maxValue}{unit}
        </span>
      </div>
      
      <div className="mt-2 text-xs text-gray-400 text-center">
        Low ← Intensity → High
      </div>
    </div>
  );
};

// Statistics component
const HeatmapStats: React.FC<{
  points: HeatmapPoint[];
  currentTime?: Date;
}> = ({ points, currentTime }) => {
  const stats = useMemo(() => {
    const intensities = points.map(p => p.intensity);
    const values = points.map(p => p.value || 0);
    
    return {
      totalPoints: points.length,
      avgIntensity: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
      maxIntensity: Math.max(...intensities),
      minIntensity: Math.min(...intensities),
      totalValue: values.reduce((sum, v) => sum + v, 0),
      hotspots: points.filter(p => p.intensity > 0.7).length
    };
  }, [points]);

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <TrendingUp className="w-4 h-4 mr-2" />
        Heatmap Statistics
      </h4>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{stats.totalPoints}</div>
          <div className="text-gray-500">Data Points</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{stats.hotspots}</div>
          <div className="text-gray-500">Hotspots</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{Math.round(stats.avgIntensity * 100)}%</div>
          <div className="text-gray-500">Avg Intensity</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{stats.totalValue.toLocaleString()}</div>
          <div className="text-gray-500">Total Value</div>
        </div>
      </div>

      {currentTime && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
          <div>Current Time: {currentTime.toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
};

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  points = generateMockHeatmapData(),
  radius = 20,
  blur = 15,
  maxZoom = 18,
  minOpacity = 0.1,
  maxOpacity = 0.8,
  gradient = gradients.heat,
  showControls = true,
  showLegend = true,
  showAnimation = true,
  animationSpeed = 1000,
  className = '',
  onIntensityChange,
  onPointClick
}) => {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const [currentGradient, setCurrentGradient] = useState('heat');
  const [currentRadius, setCurrentRadius] = useState(radius);
  const [currentBlur, setCurrentBlur] = useState(blur);
  const [currentOpacity, setCurrentOpacity] = useState(maxOpacity);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(animationSpeed);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Convert points to Leaflet heatmap format
  const formatPointsForHeatmap = (pointsData: HeatmapPoint[], frame?: number) => {
    if (!showAnimation || frame === undefined) {
      return pointsData.map(point => [point.lat, point.lng, point.intensity]);
    }

    // Animate based on timestamp
    const now = new Date();
    const timeRange = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const animationTime = now.getTime() - (frame * currentSpeed);

    return pointsData
      .filter(point => {
        if (!point.timestamp) return true;
        const pointTime = point.timestamp.getTime();
        return Math.abs(pointTime - animationTime) < timeRange / 10;
      })
      .map(point => {
        // Vary intensity based on time proximity
        let intensity = point.intensity;
        if (point.timestamp) {
          const timeDiff = Math.abs(point.timestamp.getTime() - animationTime);
          const fadeDistance = timeRange / 20;
          if (timeDiff < fadeDistance) {
            intensity *= 1 - (timeDiff / fadeDistance);
          }
        }
        return [point.lat, point.lng, Math.max(0, intensity)];
      });
  };

  // Initialize and update heatmap layer
  useEffect(() => {
    if (!map || !points.length) return;

    // Remove existing layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create new heatmap layer
    const heatmapData = formatPointsForHeatmap(points, showAnimation ? animationFrame : undefined);
    
    // @ts-ignore - Leaflet.heat types might not be perfect
    const heatLayer = L.heatLayer(heatmapData, {
      radius: currentRadius,
      blur: currentBlur,
      maxZoom: maxZoom,
      minOpacity: minOpacity,
      max: 1.0,
      gradient: gradients[currentGradient as keyof typeof gradients]
    });

    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points, currentRadius, currentBlur, currentGradient, animationFrame, showAnimation, currentSpeed]);

  // Animation loop
  useEffect(() => {
    if (isAnimating && showAnimation) {
      animationRef.current = setInterval(() => {
        setAnimationFrame(prev => prev + 1);
        setCurrentTime(new Date(Date.now() - (animationFrame * currentSpeed)));
      }, currentSpeed);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isAnimating, currentSpeed, animationFrame, showAnimation]);

  // Handle intensity change callback
  useEffect(() => {
    const avgIntensity = points.reduce((sum, p) => sum + p.intensity, 0) / points.length;
    onIntensityChange?.(avgIntensity);
  }, [points, onIntensityChange]);

  const handleReset = () => {
    setCurrentRadius(radius);
    setCurrentBlur(blur);
    setCurrentOpacity(maxOpacity);
    setCurrentGradient('heat');
    setCurrentSpeed(animationSpeed);
    setIsAnimating(false);
    setAnimationFrame(0);
  };

  const handleExport = () => {
    const exportData = {
      points: points,
      settings: {
        radius: currentRadius,
        blur: currentBlur,
        opacity: currentOpacity,
        gradient: currentGradient,
        timestamp: new Date().toISOString()
      },
      statistics: {
        totalPoints: points.length,
        avgIntensity: points.reduce((sum, p) => sum + p.intensity, 0) / points.length,
        hotspots: points.filter(p => p.intensity > 0.7).length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heatmap-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const minValue = Math.min(...points.map(p => p.value || p.intensity));
  const maxValue = Math.max(...points.map(p => p.value || p.intensity));

  return (
    <div className={className}>
      {/* Controls */}
      {showControls && (
        <HeatmapControls
          radius={currentRadius}
          blur={currentBlur}
          opacity={currentOpacity}
          gradient={currentGradient}
          isAnimating={isAnimating}
          animationSpeed={currentSpeed}
          onRadiusChange={setCurrentRadius}
          onBlurChange={setCurrentBlur}
          onOpacityChange={setCurrentOpacity}
          onGradientChange={setCurrentGradient}
          onToggleAnimation={() => setIsAnimating(!isAnimating)}
          onSpeedChange={setCurrentSpeed}
          onReset={handleReset}
          onExport={handleExport}
        />
      )}

      {/* Statistics */}
      <HeatmapStats points={points} currentTime={showAnimation ? currentTime : undefined} />

      {/* Legend */}
      {showLegend && (
        <HeatmapLegend
          gradient={gradients[currentGradient as keyof typeof gradients]}
          minValue={Math.round(minValue)}
          maxValue={Math.round(maxValue)}
          unit="%"
        />
      )}
    </div>
  );
};

export default HeatmapOverlay;