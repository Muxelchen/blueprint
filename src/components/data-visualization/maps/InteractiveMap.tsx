import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  ZoomIn, 
  ZoomOut, 
  Locate, 
  Navigation, 
  Layers, 
  MapPin,
  Search,
  Download,
  Share2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  data?: Record<string, any>;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface InteractiveMapProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string | number;
  showControls?: boolean;
  showSearch?: boolean;
  showLayerControl?: boolean;
  enableClustering?: boolean;
  onLocationClick?: (location: MapLocation) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  className?: string;
  interactive?: boolean;
  showScale?: boolean;
  showAttribution?: boolean;
}

// Mock locations data
const mockLocations: MapLocation[] = [
  {
    id: '1',
    lat: 37.7749,
    lng: -122.4194,
    title: 'San Francisco Office',
    description: 'Main headquarters with 200+ employees',
    category: 'office',
    color: '#3B82F6',
    data: { employees: 250, revenue: 5000000 }
  },
  {
    id: '2',
    lat: 40.7128,
    lng: -74.0060,
    title: 'New York Branch',
    description: 'East coast operations center',
    category: 'office',
    color: '#10B981',
    data: { employees: 180, revenue: 3500000 }
  },
  {
    id: '3',
    lat: 34.0522,
    lng: -118.2437,
    title: 'Los Angeles Studio',
    description: 'Creative design studio',
    category: 'studio',
    color: '#F59E0B',
    data: { employees: 95, revenue: 2000000 }
  },
  {
    id: '4',
    lat: 41.8781,
    lng: -87.6298,
    title: 'Chicago Hub',
    description: 'Midwest distribution center',
    category: 'warehouse',
    color: '#EF4444',
    data: { employees: 120, revenue: 1800000 }
  },
  {
    id: '5',
    lat: 32.7767,
    lng: -96.7970,
    title: 'Dallas Operations',
    description: 'Southern region office',
    category: 'office',
    color: '#8B5CF6',
    data: { employees: 85, revenue: 1500000 }
  },
  {
    id: '6',
    lat: 47.6062,
    lng: -122.3321,
    title: 'Seattle Tech Center',
    description: 'Technology development facility',
    category: 'tech',
    color: '#06B6D4',
    data: { employees: 300, revenue: 8000000 }
  },
  {
    id: '7',
    lat: 25.7617,
    lng: -80.1918,
    title: 'Miami Sales Office',
    description: 'Latin America sales division',
    category: 'sales',
    color: '#EC4899',
    data: { employees: 60, revenue: 1200000 }
  },
  {
    id: '8',
    lat: 39.7392,
    lng: -104.9903,
    title: 'Denver Logistics',
    description: 'Mountain region logistics center',
    category: 'warehouse',
    color: '#84CC16',
    data: { employees: 75, revenue: 900000 }
  }
];

// Custom icon factory
const createCustomIcon = (color: string, category: string) => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      font-weight: bold;
    ">
      ${category.charAt(0).toUpperCase()}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Map controls component
const MapControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onReset: () => void;
  showLayerControl: boolean;
  onToggleLayer: () => void;
}> = ({ onZoomIn, onZoomOut, onLocate, onReset, showLayerControl, onToggleLayer }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onLocate}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Find my location"
        >
          <Locate className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Reset view"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {showLayerControl && (
        <button
          onClick={onToggleLayer}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Toggle layers"
        >
          <Layers className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Search component
const MapSearch: React.FC<{
  onSearch: (query: string) => void;
  locations: MapLocation[];
}> = ({ onSearch, locations }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = locations.filter(location =>
        location.title.toLowerCase().includes(query.toLowerCase()) ||
        location.description?.toLowerCase().includes(query.toLowerCase()) ||
        location.category?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
      setIsOpen(true);
    } else {
      setFilteredLocations([]);
      setIsOpen(false);
    }
  }, [query, locations]);

  const handleLocationSelect = (location: MapLocation) => {
    setQuery(location.title);
    setIsOpen(false);
    onSearch(location.title);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-80">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {isOpen && filteredLocations.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: location.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{location.title}</div>
                    <div className="text-sm text-gray-500">{location.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Map event handlers
const MapEventHandlers: React.FC<{
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}> = ({ onMapClick, onBoundsChange }) => {
  const map = useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    moveend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        });
      }
    }
  });

  return null;
};

// Map controller component
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  onControlsReady: (controls: any) => void;
}> = ({ center, zoom, onControlsReady }) => {
  const map = useMap();

  useEffect(() => {
    onControlsReady({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      locate: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              map.setView([position.coords.latitude, position.coords.longitude], 15);
            },
            (error) => {
              console.warn('Geolocation failed:', error);
            }
          );
        }
      },
      reset: () => map.setView(center, zoom),
      flyTo: (lat: number, lng: number, zoomLevel?: number) => {
        map.flyTo([lat, lng], zoomLevel || map.getZoom());
      }
    });
  }, [map, center, zoom, onControlsReady]);

  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations = mockLocations,
  center = [39.8283, -98.5795], // Geographic center of US
  zoom = 4,
  height = '500px',
  showControls = true,
  showSearch = true,
  showLayerControl = true,
  onLocationClick,
  onMapClick,
  onBoundsChange,
  className = '',
  interactive = true,
  showScale = true,
  showAttribution = true
}) => {
  const [mapControls, setMapControls] = useState<any>(null);
  const [currentLayer, setCurrentLayer] = useState<string>('openstreetmap');
  const mapRef = useRef<any>(null);

  // Tile layer configurations
  const tileLayers = {
    openstreetmap: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© <a href="https://www.esri.com/">Esri</a>'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://opentopomap.org/">OpenTopoMap</a>'
    }
  };

  const handleLocationClick = (location: MapLocation) => {
    if (mapControls) {
      mapControls.flyTo(location.lat, location.lng, 12);
    }
    onLocationClick?.(location);
  };

  const handleSearch = (query: string) => {
    const location = locations.find(loc => 
      loc.title.toLowerCase().includes(query.toLowerCase())
    );
    if (location) {
      handleLocationClick(location);
    }
  };

  const toggleLayer = () => {
    const layers = Object.keys(tileLayers);
    const currentIndex = layers.indexOf(currentLayer);
    const nextIndex = (currentIndex + 1) % layers.length;
    setCurrentLayer(layers[nextIndex]);
  };

  const handleExport = () => {
    // Export map data as JSON
    const exportData = {
      locations,
      center,
      zoom,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `map-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Interactive Map',
          text: 'Check out this interactive map with location data',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Map URL copied to clipboard!');
    }
  };

  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {locations.length} locations
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export data"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share map"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: mapHeight }}>
        <MapContainer
          ref={mapRef}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={showAttribution}
          scrollWheelZoom={interactive}
          dragging={interactive}
          touchZoom={interactive}
          doubleClickZoom={interactive}
          boxZoom={interactive}
          keyboard={interactive}
        >
          {/* Tile Layer */}
          <TileLayer
            url={tileLayers[currentLayer as keyof typeof tileLayers].url}
            attribution={tileLayers[currentLayer as keyof typeof tileLayers].attribution}
          />

          {/* Map Event Handlers */}
          <MapEventHandlers
            onMapClick={onMapClick}
            onBoundsChange={onBoundsChange}
          />

          {/* Map Controller */}
          <MapController
            center={center}
            zoom={zoom}
            onControlsReady={setMapControls}
          />

          {/* Location Markers */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.color || '#3B82F6', location.category || 'default')}
              eventHandlers={{
                click: () => handleLocationClick(location)
              }}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: location.color }}
                    />
                    <h4 className="font-semibold text-gray-900">{location.title}</h4>
                  </div>
                  
                  {location.description && (
                    <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                  )}
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium capitalize">{location.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Coordinates:</span>
                      <span className="font-medium">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </span>
                    </div>
                    
                    {location.data && (
                      <>
                        {Object.entries(location.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span className="font-medium">
                              {typeof value === 'number' && key.includes('revenue') 
                                ? `$${value.toLocaleString()}`
                                : value?.toLocaleString()
                              }
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Search */}
        {showSearch && (
          <MapSearch
            onSearch={handleSearch}
            locations={locations}
          />
        )}

        {/* Controls */}
        {showControls && mapControls && (
          <MapControls
            onZoomIn={mapControls.zoomIn}
            onZoomOut={mapControls.zoomOut}
            onLocate={mapControls.locate}
            onReset={mapControls.reset}
            showLayerControl={showLayerControl}
            onToggleLayer={toggleLayer}
          />
        )}

        {/* Layer indicator */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
          {currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)} View
        </div>

        {/* Scale indicator */}
        {showScale && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            Zoom: {zoom}
          </div>
        )}
      </div>

      {/* Footer with statistics */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-gray-600">
                {locations.filter(l => l.category === 'office').length} Offices
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600">
                {locations.filter(l => l.category === 'warehouse').length} Warehouses
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-gray-600">
                {locations.filter(l => l.category === 'studio').length} Studios
              </span>
            </div>
          </div>
          
          <div className="text-gray-500">
            Total locations: {locations.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;