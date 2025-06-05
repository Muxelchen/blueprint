import React, { useState, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building, 
  Warehouse, 
  Palette, 
  Users, 
  DollarSign,
  Filter,
  Eye,
  EyeOff,
  RotateCcw,
  Edit,
  Trash2
} from 'lucide-react';

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category: string;
  color: string;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  data?: Record<string, any>;
  visible?: boolean;
  clusterId?: string;
}

export interface MarkerCategory {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  count: number;
  visible: boolean;
}

export interface MapMarkersProps {
  markers?: MarkerData[];
  categories?: MarkerCategory[];
  showFilters?: boolean;
  showLegend?: boolean;
  enableClustering?: boolean;
  onMarkerClick?: (marker: MarkerData) => void;
  onMarkerEdit?: (marker: MarkerData) => void;
  onMarkerDelete?: (markerId: string) => void;
  className?: string;
}

// Mock marker data
const mockMarkers: MarkerData[] = [
  {
    id: 'SF001',
    lat: 37.7749,
    lng: -122.4194,
    title: 'San Francisco HQ',
    description: 'Main headquarters building with executive offices',
    category: 'headquarters',
    color: '#3B82F6',
    size: 'large',
    data: { 
      employees: 250, 
      revenue: 5000000, 
      established: '2015',
      floors: 15,
      sqft: 50000
    },
    visible: true
  },
  {
    id: 'SF002',
    lat: 37.7849,
    lng: -122.4094,
    title: 'SF Development Center',
    description: 'Software development and engineering',
    category: 'development',
    color: '#10B981',
    size: 'medium',
    data: { 
      employees: 120, 
      revenue: 2500000,
      established: '2018',
      teams: 8
    },
    visible: true
  },
  {
    id: 'NYC001',
    lat: 40.7128,
    lng: -74.0060,
    title: 'New York Office',
    description: 'East coast business operations',
    category: 'office',
    color: '#F59E0B',
    size: 'medium',
    data: { 
      employees: 180, 
      revenue: 3500000,
      established: '2017',
      floors: 8
    },
    visible: true
  },
  {
    id: 'NYC002',
    lat: 40.7228,
    lng: -73.9960,
    title: 'NYC Warehouse',
    description: 'Distribution and logistics center',
    category: 'warehouse',
    color: '#EF4444',
    size: 'large',
    data: { 
      employees: 85, 
      capacity: 100000,
      established: '2019',
      sqft: 200000
    },
    visible: true
  },
  {
    id: 'LA001',
    lat: 34.0522,
    lng: -118.2437,
    title: 'Los Angeles Studio',
    description: 'Creative design and media production',
    category: 'studio',
    color: '#8B5CF6',
    size: 'medium',
    data: { 
      employees: 95, 
      revenue: 2000000,
      established: '2020',
      studios: 5
    },
    visible: true
  },
  {
    id: 'CHI001',
    lat: 41.8781,
    lng: -87.6298,
    title: 'Chicago Hub',
    description: 'Midwest regional operations',
    category: 'office',
    color: '#F59E0B',
    size: 'medium',
    data: { 
      employees: 120, 
      revenue: 1800000,
      established: '2019'
    },
    visible: true
  },
  {
    id: 'SEA001',
    lat: 47.6062,
    lng: -122.3321,
    title: 'Seattle Tech Campus',
    description: 'Advanced technology research facility',
    category: 'research',
    color: '#06B6D4',
    size: 'large',
    data: { 
      employees: 300, 
      revenue: 8000000,
      established: '2016',
      labs: 12,
      patents: 45
    },
    visible: true
  },
  {
    id: 'MIA001',
    lat: 25.7617,
    lng: -80.1918,
    title: 'Miami Sales Office',
    description: 'Latin America sales division',
    category: 'sales',
    color: '#EC4899',
    size: 'small',
    data: { 
      employees: 60, 
      revenue: 1200000,
      established: '2021',
      territories: 15
    },
    visible: true
  },
  {
    id: 'DEN001',
    lat: 39.7392,
    lng: -104.9903,
    title: 'Denver Distribution',
    description: 'Mountain region logistics center',
    category: 'warehouse',
    color: '#EF4444',
    size: 'medium',
    data: { 
      employees: 75, 
      capacity: 75000,
      established: '2022'
    },
    visible: true
  },
  {
    id: 'AUS001',
    lat: 30.2672,
    lng: -97.7431,
    title: 'Austin Innovation Lab',
    description: 'Emerging technology incubator',
    category: 'research',
    color: '#06B6D4',
    size: 'small',
    data: { 
      employees: 45, 
      projects: 8,
      established: '2023'
    },
    visible: true
  }
];

// Mock categories
const mockCategories: MarkerCategory[] = [
  {
    id: 'headquarters',
    name: 'Headquarters',
    color: '#3B82F6',
    icon: <Building className="w-4 h-4" />,
    count: 1,
    visible: true
  },
  {
    id: 'office',
    name: 'Offices',
    color: '#F59E0B',
    icon: <Building className="w-4 h-4" />,
    count: 2,
    visible: true
  },
  {
    id: 'warehouse',
    name: 'Warehouses',
    color: '#EF4444',
    icon: <Warehouse className="w-4 h-4" />,
    count: 2,
    visible: true
  },
  {
    id: 'development',
    name: 'Development',
    color: '#10B981',
    icon: <Users className="w-4 h-4" />,
    count: 1,
    visible: true
  },
  {
    id: 'studio',
    name: 'Studios',
    color: '#8B5CF6',
    icon: <Palette className="w-4 h-4" />,
    count: 1,
    visible: true
  },
  {
    id: 'research',
    name: 'Research',
    color: '#06B6D4',
    icon: <Users className="w-4 h-4" />,
    count: 2,
    visible: true
  },
  {
    id: 'sales',
    name: 'Sales',
    color: '#EC4899',
    icon: <DollarSign className="w-4 h-4" />,
    count: 1,
    visible: true
  }
];

// Custom marker icon factory
const createMarkerIcon = (marker: MarkerData) => {
  const sizeMap = {
    small: { width: 25, height: 25, fontSize: 10 },
    medium: { width: 30, height: 30, fontSize: 12 },
    large: { width: 35, height: 35, fontSize: 14 }
  };

  const size = sizeMap[marker.size || 'medium'];
  
  const iconHtml = `
    <div style="
      background-color: ${marker.color};
      width: ${size.width}px;
      height: ${size.height}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size.fontSize}px;
      color: white;
      font-weight: bold;
      position: relative;
    ">
      ${marker.category.charAt(0).toUpperCase()}
      ${marker.size === 'large' ? '<div style="position: absolute; top: -8px; right: -8px; width: 12px; height: 12px; background: #fbbf24; border-radius: 50%; border: 2px solid white;"></div>' : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [size.width, size.height],
    iconAnchor: [size.width / 2, size.height / 2],
    popupAnchor: [0, -size.height / 2]
  });
};

// Marker popup component
const MarkerPopup: React.FC<{
  marker: MarkerData;
  onEdit?: (marker: MarkerData) => void;
  onDelete?: (markerId: string) => void;
}> = ({ marker, onEdit, onDelete }) => {
  const formatValue = (key: string, value: any) => {
    if (typeof value === 'number') {
      if (key.includes('revenue') || key.includes('salary')) {
        return `$${value.toLocaleString()}`;
      }
      if (key.includes('capacity') || key.includes('sqft')) {
        return `${value.toLocaleString()} ${key.includes('sqft') ? 'sq ft' : 'units'}`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="min-w-[250px] max-w-[300px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: marker.color }}
          />
          <h4 className="font-semibold text-gray-900 text-sm">{marker.title}</h4>
        </div>
        
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(marker)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit marker"
            >
              <Edit className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(marker.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete marker"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {marker.description && (
        <p className="text-sm text-gray-600 mb-3">{marker.description}</p>
      )}

      {/* Details */}
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-500">Category:</span>
            <div className="font-medium capitalize">{marker.category}</div>
          </div>
          <div>
            <span className="text-gray-500">Size:</span>
            <div className="font-medium capitalize">{marker.size || 'medium'}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-500">Latitude:</span>
            <div className="font-medium">{marker.lat.toFixed(4)}</div>
          </div>
          <div>
            <span className="text-gray-500">Longitude:</span>
            <div className="font-medium">{marker.lng.toFixed(4)}</div>
          </div>
        </div>

        {/* Custom data */}
        {marker.data && Object.keys(marker.data).length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-gray-500 mb-1">Additional Data:</div>
            <div className="space-y-1">
              {Object.entries(marker.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-medium">{formatValue(key, value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Category filter component
const CategoryFilter: React.FC<{
  categories: MarkerCategory[];
  onCategoryToggle: (categoryId: string) => void;
  onReset: () => void;
}> = ({ categories, onCategoryToggle, onReset }) => {
  const visibleCount = categories.filter(c => c.visible).length;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Categories
        </h4>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          title="Show all categories"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryToggle(category.id)}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
              category.visible 
                ? 'bg-gray-50 hover:bg-gray-100' 
                : 'bg-gray-100 opacity-50 hover:opacity-75'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex items-center space-x-2">
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{category.count}</span>
              {category.visible ? (
                <Eye className="w-3 h-3 text-green-600" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Showing {visibleCount} of {categories.length} categories
      </div>
    </div>
  );
};

// Statistics component
const MarkerStats: React.FC<{ markers: MarkerData[] }> = ({ markers }) => {
  const stats = useMemo(() => {
    const visibleMarkers = markers.filter(m => m.visible);
    const totalEmployees = visibleMarkers.reduce((sum, m) => sum + (m.data?.employees || 0), 0);
    const totalRevenue = visibleMarkers.reduce((sum, m) => sum + (m.data?.revenue || 0), 0);
    const categories = [...new Set(visibleMarkers.map(m => m.category))].length;
    
    return {
      total: visibleMarkers.length,
      employees: totalEmployees,
      revenue: totalRevenue,
      categories
    };
  }, [markers]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Markers</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
          <div className="text-xs text-gray-500">Categories</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{stats.employees.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Employees</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">${(stats.revenue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>
      </div>
    </div>
  );
};

const MapMarkers: React.FC<MapMarkersProps> = ({
  markers = mockMarkers,
  categories = mockCategories,
  showFilters = true,
  showLegend = true,
  onMarkerClick,
  onMarkerEdit,
  onMarkerDelete,
  className = ''
}) => {
  const [localMarkers, setLocalMarkers] = useState<MarkerData[]>(markers);
  const [localCategories, setLocalCategories] = useState<MarkerCategory[]>(categories);

  // Filter visible markers based on category visibility
  const visibleMarkers = useMemo(() => {
    const visibleCategoryIds = new Set(
      localCategories.filter(c => c.visible).map(c => c.id)
    );
    return localMarkers.filter(
      marker => marker.visible && visibleCategoryIds.has(marker.category)
    );
  }, [localMarkers, localCategories]);

  const handleMarkerClick = (marker: MarkerData) => {
    onMarkerClick?.(marker);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setLocalCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, visible: !cat.visible } : cat
      )
    );
  };

  const handleCategoryReset = () => {
    setLocalCategories(prev =>
      prev.map(cat => ({ ...cat, visible: true }))
    );
  };

  const handleMarkerEdit = (marker: MarkerData) => {
    onMarkerEdit?.(marker);
  };

  const handleMarkerDelete = (markerId: string) => {
    if (window.confirm('Are you sure you want to delete this marker?')) {
      setLocalMarkers(prev => prev.filter(m => m.id !== markerId));
      onMarkerDelete?.(markerId);
    }
  };

  return (
    <div className={className}>
      {/* Markers */}
      {visibleMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={createMarkerIcon(marker)}
          eventHandlers={{
            click: () => handleMarkerClick(marker)
          }}
        >
          <Popup>
            <MarkerPopup
              marker={marker}
              onEdit={handleMarkerEdit}
              onDelete={handleMarkerDelete}
            />
          </Popup>
        </Marker>
      ))}

      {/* Controls Panel */}
      {(showFilters || showLegend) && (
        <div className="absolute top-4 left-4 z-[1000] space-y-4 max-w-xs">
          {/* Category Filters */}
          {showFilters && (
            <CategoryFilter
              categories={localCategories}
              onCategoryToggle={handleCategoryToggle}
              onReset={handleCategoryReset}
            />
          )}

          {/* Statistics */}
          {showLegend && (
            <MarkerStats markers={localMarkers} />
          )}
        </div>
      )}
    </div>
  );
};

export default MapMarkers;