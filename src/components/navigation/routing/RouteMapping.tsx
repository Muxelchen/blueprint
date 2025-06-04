import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Route, 
  Navigation, 
  Clock, 
  MapPin, 
  Truck, 
  Car,
  Bike,
  Navigation2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Zap,
  AlertTriangle
} from 'lucide-react';

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp?: Date;
  speed?: number;
  elevation?: number;
  heading?: number;
}

export interface RouteData {
  id: string;
  name: string;
  description?: string;
  points: RoutePoint[];
  color: string;
  type: 'driving' | 'walking' | 'cycling' | 'transit' | 'delivery';
  distance?: number;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'planned' | 'delayed';
  metadata?: Record<string, any>;
  visible?: boolean;
}

export interface RouteMapProps {
  routes?: RouteData[];
  showControls?: boolean;
  showAnimation?: boolean;
  animationSpeed?: number;
  showWaypoints?: boolean;
  showTraffic?: boolean;
  onRouteClick?: (route: RouteData) => void;
  onWaypointClick?: (point: RoutePoint, route: RouteData) => void;
  className?: string;
}

// Generate mock route data
const generateMockRoutes = (): RouteData[] => {
  const routes: RouteData[] = [];

  // Route 1: San Francisco to Los Angeles (Highway Route)
  const sfToLaPoints: RoutePoint[] = [];
  const sfToLaWaypoints = [
    { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
    { lat: 37.4419, lng: -122.1430, name: 'Palo Alto' },
    { lat: 36.7783, lng: -119.4179, name: 'Fresno' },
    { lat: 35.3733, lng: -119.0187, name: 'Bakersfield' },
    { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' }
  ];

  for (let i = 0; i < sfToLaWaypoints.length - 1; i++) {
    const start = sfToLaWaypoints[i];
    const end = sfToLaWaypoints[i + 1];
    const segments = 20;
    
    for (let j = 0; j <= segments; j++) {
      const ratio = j / segments;
      const lat = start.lat + (end.lat - start.lat) * ratio;
      const lng = start.lng + (end.lng - start.lng) * ratio;
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() + (i * 60) + (j * 3));
      
      sfToLaPoints.push({
        lat,
        lng,
        timestamp,
        speed: 65 + Math.random() * 15,
        elevation: Math.random() * 1000,
        heading: Math.random() * 360
      });
    }
  }

  routes.push({
    id: 'route_1',
    name: 'SF to LA Express',
    description: 'Highway route from San Francisco to Los Angeles',
    points: sfToLaPoints,
    color: '#3B82F6',
    type: 'driving',
    distance: 383,
    duration: 360,
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    endTime: new Date(),
    status: 'completed',
    metadata: {
      driver: 'John Doe',
      vehicle: 'Truck-001',
      cargo: 'Electronics',
      fuelUsed: 45.2
    },
    visible: true
  });

  // Route 2: New York City Delivery Routes
  const nycDeliveryPoints: RoutePoint[] = [];
  const nycStops = [
    { lat: 40.7128, lng: -74.0060, name: 'Manhattan Depot' },
    { lat: 40.7589, lng: -73.9851, name: 'Times Square' },
    { lat: 40.7831, lng: -73.9712, name: 'Central Park' },
    { lat: 40.7505, lng: -73.9934, name: 'Hell\'s Kitchen' },
    { lat: 40.7282, lng: -74.0776, name: 'Jersey City' },
    { lat: 40.7128, lng: -74.0060, name: 'Return to Depot' }
  ];

  for (let i = 0; i < nycStops.length - 1; i++) {
    const start = nycStops[i];
    const end = nycStops[i + 1];
    const segments = 15;
    
    for (let j = 0; j <= segments; j++) {
      const ratio = j / segments;
      const lat = start.lat + (end.lat - start.lat) * ratio + (Math.random() - 0.5) * 0.001;
      const lng = start.lng + (end.lng - start.lng) * ratio + (Math.random() - 0.5) * 0.001;
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() + (i * 30) + (j * 2));
      
      nycDeliveryPoints.push({
        lat,
        lng,
        timestamp,
        speed: 25 + Math.random() * 20,
        elevation: Math.random() * 50,
        heading: Math.random() * 360
      });
    }
  }

  routes.push({
    id: 'route_2',
    name: 'NYC Delivery Circuit',
    description: 'Daily delivery route through Manhattan',
    points: nycDeliveryPoints,
    color: '#10B981',
    type: 'delivery',
    distance: 45,
    duration: 180,
    startTime: new Date(),
    status: 'active',
    metadata: {
      driver: 'Maria Garcia',
      vehicle: 'Van-007',
      deliveries: 12,
      packages: 87
    },
    visible: true
  });

  // Route 3: Chicago to Milwaukee
  const chiToMilPoints: RoutePoint[] = [];
  const chiToMilWaypoints = [
    { lat: 41.8781, lng: -87.6298, name: 'Chicago' },
    { lat: 42.0308, lng: -87.6890, name: 'Evanston' },
    { lat: 42.3314, lng: -87.8458, name: 'Waukegan' },
    { lat: 42.5584, lng: -87.8212, name: 'Kenosha' },
    { lat: 43.0389, lng: -87.9065, name: 'Milwaukee' }
  ];

  for (let i = 0; i < chiToMilWaypoints.length - 1; i++) {
    const start = chiToMilWaypoints[i];
    const end = chiToMilWaypoints[i + 1];
    const segments = 12;
    
    for (let j = 0; j <= segments; j++) {
      const ratio = j / segments;
      const lat = start.lat + (end.lat - start.lat) * ratio;
      const lng = start.lng + (end.lng - start.lng) * ratio;
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() + 2);
      timestamp.setMinutes(timestamp.getMinutes() + (i * 20) + (j * 2));
      
      chiToMilPoints.push({
        lat,
        lng,
        timestamp,
        speed: 55 + Math.random() * 10,
        elevation: Math.random() * 200,
        heading: Math.random() * 360
      });
    }
  }

  routes.push({
    id: 'route_3',
    name: 'Chicago-Milwaukee Express',
    description: 'Scheduled transport to Milwaukee',
    points: chiToMilPoints,
    color: '#F59E0B',
    type: 'transit',
    distance: 92,
    duration: 120,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'planned',
    metadata: {
      driver: 'Robert Johnson',
      vehicle: 'Bus-203',
      passengers: 28,
      route: 'Express-92'
    },
    visible: true
  });

  // Route 4: Seattle Bike Tour
  const seattleBikePoints: RoutePoint[] = [];
  const bikeStops = [
    { lat: 47.6062, lng: -122.3321, name: 'Pike Place Market' },
    { lat: 47.6205, lng: -122.3493, name: 'Seattle Center' },
    { lat: 47.6278, lng: -122.3540, name: 'Queen Anne Hill' },
    { lat: 47.6587, lng: -122.3248, name: 'Fremont' },
    { lat: 47.6815, lng: -122.3414, name: 'Ballard' },
    { lat: 47.6734, lng: -122.3853, name: 'Discovery Park' },
    { lat: 47.6062, lng: -122.3321, name: 'Return to Start' }
  ];

  for (let i = 0; i < bikeStops.length - 1; i++) {
    const start = bikeStops[i];
    const end = bikeStops[i + 1];
    const segments = 10;
    
    for (let j = 0; j <= segments; j++) {
      const ratio = j / segments;
      const lat = start.lat + (end.lat - start.lat) * ratio + (Math.random() - 0.5) * 0.002;
      const lng = start.lng + (end.lng - start.lng) * ratio + (Math.random() - 0.5) * 0.002;
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - 60 + (i * 15) + (j * 1.5));
      
      seattleBikePoints.push({
        lat,
        lng,
        timestamp,
        speed: 12 + Math.random() * 8,
        elevation: Math.random() * 150,
        heading: Math.random() * 360
      });
    }
  }

  routes.push({
    id: 'route_4',
    name: 'Seattle Bike Tour',
    description: 'Scenic cycling route through Seattle',
    points: seattleBikePoints,
    color: '#8B5CF6',
    type: 'cycling',
    distance: 25,
    duration: 90,
    startTime: new Date(Date.now() - 90 * 60 * 1000),
    endTime: new Date(),
    status: 'completed',
    metadata: {
      cyclist: 'Emily Chen',
      bike: 'Mountain-Bike-12',
      calories: 680,
      avgSpeed: 16.7
    },
    visible: true
  });

  return routes;
};

// Route type configurations
const routeTypeConfig = {
  driving: { icon: Car, color: '#3B82F6', strokeWidth: 4 },
  walking: { icon: Navigation, color: '#10B981', strokeWidth: 3 },
  cycling: { icon: Bike, color: '#8B5CF6', strokeWidth: 3 },
  transit: { icon: Truck, color: '#F59E0B', strokeWidth: 5 },
  delivery: { icon: Truck, color: '#EF4444', strokeWidth: 4 }
};

// Route controls component
const RouteControls: React.FC<{
  routes: RouteData[];
  isAnimating: boolean;
  animationSpeed: number;
  showWaypoints: boolean;
  onToggleAnimation: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleWaypoints: () => void;
  onRouteToggle: (routeId: string) => void;
  onReset: () => void;
  onExport: () => void;
}> = ({
  routes,
  isAnimating,
  animationSpeed,
  showWaypoints,
  onToggleAnimation,
  onSpeedChange,
  onToggleWaypoints,
  onRouteToggle,
  onReset,
  onExport
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Route className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-sm">Routes</span>
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
            onClick={onToggleWaypoints}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              showWaypoints 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Waypoints</span>
          </button>
          
          <button
            onClick={onReset}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          
          <button
            onClick={onExport}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Export routes"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>

        {/* Route List */}
        <div className="space-y-1">
          {routes.map((route) => {
            const config = routeTypeConfig[route.type];
            const Icon = config.icon;
            
            return (
              <button
                key={route.id}
                onClick={() => onRouteToggle(route.id)}
                className={`w-full flex items-center justify-between p-2 rounded text-left transition-all ${
                  route.visible 
                    ? 'bg-gray-50 hover:bg-gray-100' 
                    : 'bg-gray-100 opacity-50 hover:opacity-75'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: route.color }}
                  />
                  <Icon className="w-3 h-3" />
                  <div>
                    <div className="text-xs font-medium">{route.name}</div>
                    <div className="text-xs text-gray-500">{route.distance}mi • {route.duration}min</div>
                  </div>
                </div>
                
                <div className={`text-xs px-1 rounded ${
                  route.status === 'active' ? 'bg-green-100 text-green-700' :
                  route.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  route.status === 'planned' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {route.status}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 space-y-3">
          {/* Animation Speed */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Animation Speed: {animationSpeed}ms
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

          {/* Route Statistics */}
          <div className="text-xs">
            <div className="font-medium text-gray-700 mb-2">Statistics</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Routes:</span>
                <span className="font-medium">{routes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active:</span>
                <span className="font-medium">{routes.filter(r => r.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Distance:</span>
                <span className="font-medium">{routes.reduce((sum, r) => sum + (r.distance || 0), 0).toFixed(1)}mi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Animated marker component
const AnimatedMarker: React.FC<{
  route: RouteData;
  animationProgress: number;
  showWaypoints: boolean;
}> = ({ route, animationProgress, showWaypoints }) => {
  const currentPointIndex = Math.floor(animationProgress * (route.points.length - 1));
  const currentPoint = route.points[currentPointIndex];
  
  if (!currentPoint) return null;

  const config = routeTypeConfig[route.type];
  const Icon = config.icon;

  // Create custom icon for moving marker
  const createMovingIcon = () => {
    const iconHtml = `
      <div style="
        background-color: ${route.color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        animation: pulse 2s infinite;
      ">
        <div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      </style>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'animated-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  return (
    <>
      {/* Moving marker */}
      <Marker
        position={[currentPoint.lat, currentPoint.lng]}
        icon={createMovingIcon()}
      >
        <Popup>
          <div className="p-2">
            <div className="flex items-center space-x-2 mb-2">
              <Icon className="w-4 h-4" style={{ color: route.color }} />
              <h4 className="font-semibold">{route.name}</h4>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Progress:</span>
                <span className="font-medium">{Math.round(animationProgress * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Speed:</span>
                <span className="font-medium">{currentPoint.speed?.toFixed(1)} mph</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Position:</span>
                <span className="font-medium">
                  {currentPoint.lat.toFixed(4)}, {currentPoint.lng.toFixed(4)}
                </span>
              </div>
              {currentPoint.timestamp && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{currentPoint.timestamp.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Waypoints */}
      {showWaypoints && route.points.filter((_, index) => index % 10 === 0).map((point, index) => (
        <Marker
          key={`waypoint_${route.id}_${index}`}
          position={[point.lat, point.lng]}
          icon={L.circleMarker([point.lat, point.lng], {
            radius: 3,
            fillColor: route.color,
            color: 'white',
            weight: 2,
            fillOpacity: 0.8
          }) as any}
        />
      ))}
    </>
  );
};

const RouteMapping: React.FC<RouteMapProps> = ({
  routes = generateMockRoutes(),
  showControls = true,
  showAnimation = true,
  animationSpeed = 500,
  showWaypoints = false,
  showTraffic = false,
  onRouteClick,
  onWaypointClick,
  className = ''
}) => {
  const [localRoutes, setLocalRoutes] = useState<RouteData[]>(routes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(animationSpeed);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentWaypoints, setCurrentWaypoints] = useState(showWaypoints);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Animation loop
  useEffect(() => {
    if (isAnimating && showAnimation) {
      animationRef.current = setInterval(() => {
        setAnimationProgress(prev => {
          const newProgress = prev + 0.01;
          return newProgress >= 1 ? 0 : newProgress;
        });
      }, currentSpeed / 10);
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
  }, [isAnimating, currentSpeed, showAnimation]);

  const handleRouteToggle = (routeId: string) => {
    setLocalRoutes(prev =>
      prev.map(route =>
        route.id === routeId ? { ...route, visible: !route.visible } : route
      )
    );
  };

  const handleReset = () => {
    setAnimationProgress(0);
    setIsAnimating(false);
    setCurrentSpeed(animationSpeed);
    setCurrentWaypoints(showWaypoints);
  };

  const handleExport = () => {
    const exportData = {
      routes: localRoutes,
      settings: {
        animationSpeed: currentSpeed,
        showWaypoints: currentWaypoints,
        timestamp: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `routes-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter visible routes
  const visibleRoutes = localRoutes.filter(route => route.visible);

  return (
    <div className={className}>
      {/* Route polylines */}
      {visibleRoutes.map((route) => {
        const config = routeTypeConfig[route.type];
        const positions = route.points.map(point => [point.lat, point.lng] as [number, number]);
        
        return (
          <Polyline
            key={route.id}
            positions={positions}
            color={route.color}
            weight={config.strokeWidth}
            opacity={0.8}
            eventHandlers={{
              click: () => onRouteClick?.(route)
            }}
          />
        );
      })}

      {/* Animated markers */}
      {isAnimating && visibleRoutes.map((route) => (
        <AnimatedMarker
          key={`animated_${route.id}`}
          route={route}
          animationProgress={animationProgress}
          showWaypoints={currentWaypoints}
        />
      ))}

      {/* Start/End markers */}
      {visibleRoutes.map((route) => {
        if (route.points.length === 0) return null;
        
        const startPoint = route.points[0];
        const endPoint = route.points[route.points.length - 1];
        const config = routeTypeConfig[route.type];
        const Icon = config.icon;

        return (
          <React.Fragment key={`markers_${route.id}`}>
            {/* Start marker */}
            <Marker
              position={[startPoint.lat, startPoint.lng]}
              icon={L.divIcon({
                html: `
                  <div style="
                    background-color: ${route.color};
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                  "></div>
                `,
                className: 'start-marker',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-medium">Start: {route.name}</div>
                  <div className="text-xs text-gray-500">
                    {startPoint.timestamp?.toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* End marker */}
            {route.status === 'completed' && (
              <Marker
                position={[endPoint.lat, endPoint.lng]}
                icon={L.divIcon({
                  html: `
                    <div style="
                      background-color: ${route.color};
                      width: 16px;
                      height: 16px;
                      border-radius: 2px;
                      border: 2px solid white;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                    "></div>
                  `,
                  className: 'end-marker',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-medium">End: {route.name}</div>
                    <div className="text-xs text-gray-500">
                      {endPoint.timestamp?.toLocaleString()}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </React.Fragment>
        );
      })}

      {/* Controls */}
      {showControls && (
        <RouteControls
          routes={localRoutes}
          isAnimating={isAnimating}
          animationSpeed={currentSpeed}
          showWaypoints={currentWaypoints}
          onToggleAnimation={() => setIsAnimating(!isAnimating)}
          onSpeedChange={setCurrentSpeed}
          onToggleWaypoints={() => setCurrentWaypoints(!currentWaypoints)}
          onRouteToggle={handleRouteToggle}
          onReset={handleReset}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default RouteMapping;