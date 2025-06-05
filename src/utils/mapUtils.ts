// Complete geographic calculation utilities for maps
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Bounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface MapMarker extends Coordinates {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  icon?: string;
  color?: string;
}

export interface HeatmapPoint extends Coordinates {
  weight: number;
  intensity?: number;
}

// Distance calculations
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates,
  unit: 'km' | 'miles' = 'km'
): number => {
  const R = unit === 'km' ? 6371 : 3959; // Earth's radius
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

// Bearing calculation
export const calculateBearing = (point1: Coordinates, point2: Coordinates): number => {
  const dLon = toRadians(point2.longitude - point1.longitude);
  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
};

// Destination point calculation
export const calculateDestination = (
  point: Coordinates,
  distance: number,
  bearing: number,
  unit: 'km' | 'miles' = 'km'
): Coordinates => {
  const R = unit === 'km' ? 6371 : 3959;
  const d = distance / R;
  const brng = toRadians(bearing);
  const lat1 = toRadians(point.latitude);
  const lon1 = toRadians(point.longitude);
  
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
  );
  
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
    Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
  );
  
  return {
    latitude: toDegrees(lat2),
    longitude: toDegrees(lon2)
  };
};

// Center point calculation
export const calculateCenter = (points: Coordinates[]): Coordinates => {
  if (points.length === 0) return { latitude: 0, longitude: 0 };
  if (points.length === 1) return points[0];
  
  const sum = points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude,
      longitude: acc.longitude + point.longitude
    }),
    { latitude: 0, longitude: 0 }
  );
  
  return {
    latitude: sum.latitude / points.length,
    longitude: sum.longitude / points.length
  };
};

// Bounds calculation
export const calculateBounds = (points: Coordinates[]): Bounds | null => {
  if (points.length === 0) {
    // Return null to indicate no bounds available
    return null;
  }
  
  const latitudes = points.map(p => p.latitude);
  const longitudes = points.map(p => p.longitude);
  
  return {
    northeast: {
      latitude: Math.max(...latitudes),
      longitude: Math.max(...longitudes)
    },
    southwest: {
      latitude: Math.min(...latitudes),
      longitude: Math.min(...longitudes)
    }
  };
};

// Point in polygon check
export const isPointInPolygon = (point: Coordinates, polygon: Coordinates[]): boolean => {
  let inside = false;
  const { latitude: x, longitude: y } = point;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const { latitude: xi, longitude: yi } = polygon[i];
    const { latitude: xj, longitude: yj } = polygon[j];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
};

// Circle bounds calculation
export const getCircleBounds = (
  center: Coordinates,
  radius: number,
  unit: 'km' | 'miles' = 'km'
): Bounds => {
  const north = calculateDestination(center, radius, 0, unit);
  const south = calculateDestination(center, radius, 180, unit);
  const east = calculateDestination(center, radius, 90, unit);
  const west = calculateDestination(center, radius, 270, unit);
  
  return {
    northeast: { latitude: north.latitude, longitude: east.longitude },
    southwest: { latitude: south.latitude, longitude: west.longitude }
  };
};

// Clustering utilities
export const clusterMarkers = (
  markers: MapMarker[],
  distance: number = 50,
  unit: 'km' | 'miles' = 'km'
): Array<{ center: Coordinates; markers: MapMarker[]; count: number }> => {
  const clusters: Array<{ center: Coordinates; markers: MapMarker[]; count: number }> = [];
  const processed = new Set<string>();
  
  markers.forEach(marker => {
    if (processed.has(marker.id)) return;
    
    const cluster = {
      center: { latitude: marker.latitude, longitude: marker.longitude },
      markers: [marker],
      count: 1
    };
    
    processed.add(marker.id);
    
    markers.forEach(otherMarker => {
      if (processed.has(otherMarker.id)) return;
      
      const dist = calculateDistance(
        { latitude: marker.latitude, longitude: marker.longitude },
        { latitude: otherMarker.latitude, longitude: otherMarker.longitude },
        unit
      );
      
      if (dist <= distance) {
        cluster.markers.push(otherMarker);
        cluster.count++;
        processed.add(otherMarker.id);
      }
    });
    
    // Recalculate center
    cluster.center = calculateCenter(cluster.markers);
    clusters.push(cluster);
  });
  
  return clusters;
};

// Viewport utilities
export const isPointInViewport = (point: Coordinates, bounds: Bounds): boolean => {
  return (
    point.latitude >= bounds.southwest.latitude &&
    point.latitude <= bounds.northeast.latitude &&
    point.longitude >= bounds.southwest.longitude &&
    point.longitude <= bounds.northeast.longitude
  );
};

export const expandBounds = (bounds: Bounds, factor: number = 0.1): Bounds => {
  const latDiff = bounds.northeast.latitude - bounds.southwest.latitude;
  const lonDiff = bounds.northeast.longitude - bounds.southwest.longitude;
  
  return {
    northeast: {
      latitude: bounds.northeast.latitude + (latDiff * factor),
      longitude: bounds.northeast.longitude + (lonDiff * factor)
    },
    southwest: {
      latitude: bounds.southwest.latitude - (latDiff * factor),
      longitude: bounds.southwest.longitude - (lonDiff * factor)
    }
  };
};

// Geolocation utilities
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

export const watchLocation = (
  callback: (position: Coordinates) => void,
  errorCallback?: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported');
  }
  
  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    errorCallback,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
};

// Coordinate formatting
export const formatCoordinates = (
  coordinates: Coordinates,
  format: 'decimal' | 'dms' | 'dm' = 'decimal',
  precision: number = 6
): string => {
  switch (format) {
    case 'decimal':
      return `${coordinates.latitude.toFixed(precision)}, ${coordinates.longitude.toFixed(precision)}`;
    
    case 'dms':
      return `${toDMS(coordinates.latitude, 'lat')}, ${toDMS(coordinates.longitude, 'lon')}`;
    
    case 'dm':
      return `${toDM(coordinates.latitude, 'lat')}, ${toDM(coordinates.longitude, 'lon')}`;
    
    default:
      return formatCoordinates(coordinates, 'decimal', precision);
  }
};

// Heatmap utilities
export const generateHeatmapData = (
  points: HeatmapPoint[],
  bounds: Bounds,
  gridSize: number = 20
): number[][] => {
  const latStep = (bounds.northeast.latitude - bounds.southwest.latitude) / gridSize;
  const lonStep = (bounds.northeast.longitude - bounds.southwest.longitude) / gridSize;
  
  const grid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  
  points.forEach(point => {
    const latIndex = Math.floor((point.latitude - bounds.southwest.latitude) / latStep);
    const lonIndex = Math.floor((point.longitude - bounds.southwest.longitude) / lonStep);
    
    if (latIndex >= 0 && latIndex < gridSize && lonIndex >= 0 && lonIndex < gridSize) {
      grid[latIndex][lonIndex] += point.weight;
    }
  });
  
  return grid;
};

// Helper functions
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

const toDMS = (coordinate: number, type: 'lat' | 'lon'): string => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  
  const direction = type === 'lat' 
    ? (coordinate >= 0 ? 'N' : 'S')
    : (coordinate >= 0 ? 'E' : 'W');
  
  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

const toDM = (coordinate: number, type: 'lat' | 'lon'): string => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutes = ((absolute - degrees) * 60).toFixed(3);
  
  const direction = type === 'lat' 
    ? (coordinate >= 0 ? 'N' : 'S')
    : (coordinate >= 0 ? 'E' : 'W');
  
  return `${degrees}°${minutes}'${direction}`;
};

export default {
  calculateDistance,
  calculateBearing,
  calculateDestination,
  calculateCenter,
  calculateBounds,
  isPointInPolygon,
  getCircleBounds,
  clusterMarkers,
  isPointInViewport,
  expandBounds,
  getCurrentLocation,
  watchLocation,
  formatCoordinates,
  generateHeatmapData
};