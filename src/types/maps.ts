// Complete map types and interfaces
import { BaseComponent } from './index';

// Core coordinate and geographic types
export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface Bounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface GeographicRegion {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'region' | 'custom';
  bounds: Bounds;
  center: Coordinates;
  population?: number;
  area?: number; // in square kilometers
  timezone?: string;
  currency?: string;
  language?: string;
}

// Map marker types
export interface MapMarker extends Coordinates {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  type?: 'point' | 'cluster' | 'custom';
  icon?: string | React.ReactNode;
  color?: string;
  size?: 'small' | 'medium' | 'large' | number;
  zIndex?: number;
  visible?: boolean;
  draggable?: boolean;
  clickable?: boolean;
  data?: Record<string, any>;
  popup?: MarkerPopup;
  tooltip?: MarkerTooltip;
  animation?: 'bounce' | 'drop' | 'none';
}

export interface MarkerPopup {
  content: React.ReactNode;
  maxWidth?: number;
  minWidth?: number;
  autoPan?: boolean;
  closeButton?: boolean;
  closeOnClick?: boolean;
  offset?: [number, number];
  className?: string;
}

export interface MarkerTooltip {
  content: string | React.ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
  permanent?: boolean;
  sticky?: boolean;
  interactive?: boolean;
  opacity?: number;
  offset?: [number, number];
  className?: string;
}

// Marker clustering
export interface MarkerCluster {
  id: string;
  center: Coordinates;
  bounds: Bounds;
  markers: MapMarker[];
  count: number;
  icon?: string | React.ReactNode;
  color?: string;
  size?: number;
  spiderfyOnMaxZoom?: boolean;
  showCoverageOnHover?: boolean;
  maxClusterRadius?: number;
}

export interface ClusterOptions {
  enabled?: boolean;
  maxClusterRadius?: number;
  minClusterSize?: number;
  spiderfyOnMaxZoom?: boolean;
  showCoverageOnHover?: boolean;
  zoomToBoundsOnClick?: boolean;
  removeOutsideVisibleBounds?: boolean;
  animate?: boolean;
  iconCreateFunction?: (cluster: MarkerCluster) => React.ReactNode;
}

// Heatmap types
export interface HeatmapPoint extends Coordinates {
  weight: number;
  intensity?: number;
  radius?: number;
  category?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface HeatmapLayer {
  id: string;
  name: string;
  data: HeatmapPoint[];
  visible?: boolean;
  opacity?: number;
  radius?: number;
  blur?: number;
  maxZoom?: number;
  gradient?: Record<number, string>;
  minOpacity?: number;
  maxIntensity?: number;
}

export interface HeatmapOptions {
  radius?: number;
  blur?: number;
  maxZoom?: number;
  max?: number;
  minOpacity?: number;
  gradient?: Record<number, string>;
  useLocalExtrema?: boolean;
}

// Map layer types
export interface MapLayer {
  id: string;
  name: string;
  type: 'tile' | 'marker' | 'heatmap' | 'polygon' | 'polyline' | 'circle' | 'custom';
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  interactive?: boolean;
  data?: any;
  style?: LayerStyle;
  options?: Record<string, any>;
}

export interface LayerStyle {
  color?: string;
  weight?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  dashArray?: string;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}

// Polygon and shape types
export interface MapPolygon {
  id: string;
  name?: string;
  coordinates: Coordinates[][];
  holes?: Coordinates[][][];
  style?: LayerStyle;
  data?: Record<string, any>;
  popup?: MarkerPopup;
  tooltip?: MarkerTooltip;
  interactive?: boolean;
  draggable?: boolean;
}

export interface MapPolyline {
  id: string;
  name?: string;
  coordinates: Coordinates[];
  style?: LayerStyle;
  data?: Record<string, any>;
  popup?: MarkerPopup;
  tooltip?: MarkerTooltip;
  interactive?: boolean;
  draggable?: boolean;
  smoothFactor?: number;
  noClip?: boolean;
}

export interface MapCircle {
  id: string;
  name?: string;
  center: Coordinates;
  radius: number; // in meters
  style?: LayerStyle;
  data?: Record<string, any>;
  popup?: MarkerPopup;
  tooltip?: MarkerTooltip;
  interactive?: boolean;
  draggable?: boolean;
}

// Map controls
export interface MapControl {
  id: string;
  type: 'zoom' | 'scale' | 'attribution' | 'layers' | 'fullscreen' | 'locate' | 'custom';
  position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  visible?: boolean;
  options?: Record<string, any>;
  component?: React.ComponentType<any>;
}

export interface ZoomControlOptions {
  zoomInText?: string;
  zoomInTitle?: string;
  zoomOutText?: string;
  zoomOutTitle?: string;
}

export interface ScaleControlOptions {
  maxWidth?: number;
  metric?: boolean;
  imperial?: boolean;
  updateWhenIdle?: boolean;
}

export interface LayerControlOptions {
  collapsed?: boolean;
  autoZIndex?: boolean;
  hideSingleBase?: boolean;
  sortLayers?: boolean;
  sortFunction?: (layerA: MapLayer, layerB: MapLayer) => number;
}

// Map events
export interface MapEvent {
  type: string;
  target: any;
  latlng?: Coordinates;
  layerPoint?: [number, number];
  containerPoint?: [number, number];
  originalEvent?: Event;
}

export interface MapEventHandlers {
  onClick?: (event: MapEvent) => void;
  onDoubleClick?: (event: MapEvent) => void;
  onMouseMove?: (event: MapEvent) => void;
  onMouseOver?: (event: MapEvent) => void;
  onMouseOut?: (event: MapEvent) => void;
  onContextMenu?: (event: MapEvent) => void;
  onMoveStart?: (event: MapEvent) => void;
  onMove?: (event: MapEvent) => void;
  onMoveEnd?: (event: MapEvent) => void;
  onZoomStart?: (event: MapEvent) => void;
  onZoom?: (event: MapEvent) => void;
  onZoomEnd?: (event: MapEvent) => void;
  onResize?: (event: MapEvent) => void;
  onLoad?: (event: MapEvent) => void;
  onUnload?: (event: MapEvent) => void;
}

// Map component props
export interface InteractiveMapProps extends BaseComponent, MapEventHandlers {
  center?: Coordinates;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  bounds?: Bounds;
  maxBounds?: Bounds;
  style?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
  className?: string;
  attribution?: string;
  zoomControl?: boolean;
  attributionControl?: boolean;
  dragging?: boolean;
  touchZoom?: boolean;
  doubleClickZoom?: boolean;
  scrollWheelZoom?: boolean;
  boxZoom?: boolean;
  keyboard?: boolean;
  keyboardPanDelta?: number;
  inertia?: boolean;
  worldCopyJump?: boolean;
  maxBoundsViscosity?: number;
  crs?: any;
  layers?: MapLayer[];
  markers?: MapMarker[];
  controls?: MapControl[];
  clusterOptions?: ClusterOptions;
  heatmapLayers?: HeatmapLayer[];
  polygons?: MapPolygon[];
  polylines?: MapPolyline[];
  circles?: MapCircle[];
  loading?: boolean;
  error?: string;
  onMapReady?: (map: any) => void;
}

// Location and geolocation types
export interface LocationData {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates: Coordinates;
  category?: string;
  subcategory?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  isOpen?: boolean;
  openingHours?: string[];
  phone?: string;
  website?: string;
  email?: string;
  features?: string[];
  amenities?: string[];
  images?: string[];
  tags?: string[];
  verified?: boolean;
  distance?: number;
  duration?: number;
  lastUpdated?: Date;
  metadata?: Record<string, any>;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}

// Geocoding types
export interface GeocodingRequest {
  query: string;
  location?: Coordinates;
  region?: string;
  language?: string;
  limit?: number;
  types?: string[];
}

export interface GeocodingResult {
  id: string;
  displayName: string;
  formattedAddress: string;
  coordinates: Coordinates;
  bounds?: Bounds;
  type: string;
  confidence: number;
  components: {
    streetNumber?: string;
    route?: string;
    locality?: string;
    administrativeArea?: string;
    country?: string;
    postalCode?: string;
  };
  metadata?: Record<string, any>;
}

export interface ReverseGeocodingRequest {
  coordinates: Coordinates;
  language?: string;
  types?: string[];
}

// Routing and directions types
export interface RouteRequest {
  origin: Coordinates | string;
  destination: Coordinates | string;
  waypoints?: (Coordinates | string)[];
  mode?: 'driving' | 'walking' | 'cycling' | 'transit';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  avoidFerries?: boolean;
  optimizeWaypoints?: boolean;
  language?: string;
  region?: string;
  units?: 'metric' | 'imperial';
}

export interface Route {
  id: string;
  summary: string;
  distance: number; // in meters
  duration: number; // in seconds
  coordinates: Coordinates[];
  bounds: Bounds;
  legs: RouteLeg[];
  warnings?: string[];
  copyrights?: string;
  fare?: RouteFare;
}

export interface RouteLeg {
  startAddress: string;
  endAddress: string;
  startLocation: Coordinates;
  endLocation: Coordinates;
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  startLocation: Coordinates;
  endLocation: Coordinates;
  coordinates: Coordinates[];
  maneuver?: string;
  travelMode?: string;
}

export interface RouteFare {
  currency: string;
  value: number;
  text: string;
}

// Map search and filtering
export interface MapSearchOptions {
  query?: string;
  category?: string;
  bounds?: Bounds;
  radius?: number;
  center?: Coordinates;
  minRating?: number;
  maxPrice?: number;
  openNow?: boolean;
  sortBy?: 'distance' | 'rating' | 'price' | 'relevance';
  limit?: number;
  offset?: number;
}

export interface MapFilter {
  id: string;
  name: string;
  type: 'category' | 'rating' | 'price' | 'distance' | 'features' | 'custom';
  options: FilterOption[];
  multiple?: boolean;
  required?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Map analytics and tracking
export interface MapAnalytics {
  views: number;
  interactions: number;
  markerClicks: number;
  popupOpens: number;
  zoomEvents: number;
  panEvents: number;
  searchQueries: number;
  routeRequests: number;
  averageViewDuration: number;
  popularLocations: Array<{ id: string; views: number }>;
  heatmapData: HeatmapPoint[];
  userPaths: Coordinates[][];
}

export interface MapTrackingEvent {
  type:
    | 'view'
    | 'interaction'
    | 'marker_click'
    | 'popup_open'
    | 'zoom'
    | 'pan'
    | 'search'
    | 'route';
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  coordinates?: Coordinates;
  zoom?: number;
  data?: Record<string, any>;
}

// Map themes and styling
export interface MapTheme {
  id: string;
  name: string;
  description?: string;
  tileLayer: string;
  attribution: string;
  minZoom?: number;
  maxZoom?: number;
  subdomains?: string[];
  options?: Record<string, any>;
  markerStyle?: MarkerStyle;
  popupStyle?: PopupStyle;
  controlStyle?: ControlStyle;
}

export interface MarkerStyle {
  defaultIcon?: string;
  selectedIcon?: string;
  clusterIcon?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  shadowUrl?: string;
  shadowSize?: [number, number];
}

export interface PopupStyle {
  maxWidth?: number;
  minWidth?: number;
  className?: string;
  closeButtonStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export interface ControlStyle {
  position?: string;
  background?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  fontSize?: string;
  padding?: string;
}

// Map utilities and helpers
export interface MapUtils {
  calculateDistance: (point1: Coordinates, point2: Coordinates, unit?: 'km' | 'miles') => number;
  calculateBearing: (point1: Coordinates, point2: Coordinates) => number;
  calculateCenter: (points: Coordinates[]) => Coordinates;
  calculateBounds: (points: Coordinates[]) => Bounds;
  isPointInBounds: (point: Coordinates, bounds: Bounds) => boolean;
  isPointInPolygon: (point: Coordinates, polygon: Coordinates[]) => boolean;
  formatDistance: (distance: number, unit?: 'km' | 'miles') => string;
  formatDuration: (duration: number) => string;
  formatCoordinates: (coordinates: Coordinates, format?: 'decimal' | 'dms') => string;
}
