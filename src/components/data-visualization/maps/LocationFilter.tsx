import React, { useState, useMemo, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Filter, 
  Search, 
  MapPin, 
  X, 
  ChevronDown, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  Car,
  Coffee,
  ShoppingBag,
  Utensils,
  Building,
  Heart,
  Zap,
  Wifi,
  ParkingCircle,
  CreditCard,
  Phone,
  Globe,
  CheckCircle,
  Settings,
  Download,
  RotateCcw
} from 'lucide-react';

export interface Location {
  id: string;
  name: string;
  description?: string;
  category: LocationCategory;
  subcategory?: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  isOpen?: boolean;
  openingHours?: string[];
  phone?: string;
  website?: string;
  features?: string[];
  amenities?: string[];
  tags?: string[];
  distance?: number;
  lastUpdated?: Date;
  verified?: boolean;
  images?: string[];
  metadata?: Record<string, any>;
}

export type LocationCategory = 
  | 'restaurant' 
  | 'hotel' 
  | 'shopping' 
  | 'entertainment' 
  | 'transport' 
  | 'business' 
  | 'healthcare' 
  | 'education' 
  | 'service'
  | 'attraction'
  | 'park'
  | 'gas'
  | 'parking';

export interface FilterOptions {
  categories: LocationCategory[];
  rating: number;
  priceLevel: number[];
  distance: number;
  isOpen: boolean | null;
  features: string[];
  searchQuery: string;
  verified: boolean | null;
}

export interface LocationFilterProps {
  showControls?: boolean;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showRatingFilter?: boolean;
  showPriceFilter?: boolean;
  showDistanceFilter?: boolean;
  showFeatureFilter?: boolean;
  defaultFilters?: Partial<FilterOptions>;
  onLocationClick?: (location: Location) => void;
  onFilterChange?: (filteredLocations: Location[], filters: FilterOptions) => void;
  className?: string;
  markerSize?: 'sm' | 'md' | 'lg';
  maxResults?: number;
}

// Generate comprehensive mock location data
const generateMockLocations = (): Location[] => {
  // New York City locations
  const nycLocations = [
    {
      id: 'nyc_1',
      name: 'The Plaza Hotel',
      description: 'Luxury hotel in the heart of Manhattan',
      category: 'hotel' as LocationCategory,
      subcategory: 'Luxury Hotel',
      lat: 40.7648,
      lng: -73.9754,
      address: '768 5th Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10019',
      rating: 4.5,
      reviewCount: 2840,
      priceLevel: 4 as const,
      isOpen: true,
      openingHours: ['24/7'],
      phone: '+1-212-759-3000',
      website: 'https://www.theplazany.com',
      features: ['wifi', 'parking', 'restaurant', 'bar', 'gym', 'spa', 'concierge'],
      amenities: ['Room Service', 'Valet Parking', 'Business Center', 'Pet Friendly'],
      tags: ['luxury', 'historic', 'central park', 'iconic'],
      verified: true,
      images: ['plaza1.jpg', 'plaza2.jpg'],
      metadata: { rooms: 282, floors: 20, built: 1907 }
    },
    {
      id: 'nyc_2',
      name: 'Katz\'s Delicatessen',
      description: 'Famous Jewish deli since 1888',
      category: 'restaurant' as LocationCategory,
      subcategory: 'Deli',
      lat: 40.7223,
      lng: -73.9877,
      address: '205 E Houston St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10002',
      rating: 4.2,
      reviewCount: 15600,
      priceLevel: 2 as const,
      isOpen: true,
      openingHours: ['Mon-Thu: 8am-10:45pm', 'Fri-Sat: 8am-2:45am', 'Sun: 8am-10:45pm'],
      phone: '+1-212-254-2246',
      website: 'https://katzsdelicatessen.com',
      features: ['takeout', 'dine-in', 'cash-only'],
      amenities: ['Historic Location', 'Famous Pastrami'],
      tags: ['historic', 'pastrami', 'nyc-institution', 'cash-only'],
      verified: true,
      metadata: { established: 1888, famous_for: 'pastrami sandwich' }
    },
    {
      id: 'nyc_3',
      name: 'Central Park',
      description: 'Iconic urban park in Manhattan',
      category: 'park' as LocationCategory,
      subcategory: 'Urban Park',
      lat: 40.7829,
      lng: -73.9654,
      address: 'Central Park',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      rating: 4.7,
      reviewCount: 98500,
      priceLevel: 1 as const,
      isOpen: true,
      openingHours: ['6am-1am daily'],
      features: ['walking', 'cycling', 'boating', 'playground', 'zoo'],
      amenities: ['Playgrounds', 'Lake', 'Walking Paths', 'Wildlife'],
      tags: ['nature', 'recreation', 'family-friendly', 'free'],
      verified: true,
      metadata: { area: '843 acres', opened: 1857 }
    },
    {
      id: 'nyc_4',
      name: 'Apple Store Fifth Avenue',
      description: '24/7 flagship Apple retail store',
      category: 'shopping' as LocationCategory,
      subcategory: 'Electronics',
      lat: 40.7634,
      lng: -73.9736,
      address: '767 5th Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10153',
      rating: 4.4,
      reviewCount: 12300,
      priceLevel: 3 as const,
      isOpen: true,
      openingHours: ['24/7'],
      phone: '+1-212-336-1440',
      website: 'https://www.apple.com/retail/fifthavenue/',
      features: ['wifi', 'genius-bar', 'workshops', 'accessibility'],
      amenities: ['Genius Bar', 'Today at Apple', 'Personal Setup'],
      tags: ['technology', 'flagship', '24-7', 'iconic'],
      verified: true,
      metadata: { floors: 3, underground: true, glass_cube: true }
    }
  ];

  // San Francisco locations
  const sfLocations = [
    {
      id: 'sf_1',
      name: 'Golden Gate Bridge',
      description: 'Iconic suspension bridge and landmark',
      category: 'attraction' as LocationCategory,
      subcategory: 'Landmark',
      lat: 37.8199,
      lng: -122.4783,
      address: 'Golden Gate Bridge',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      rating: 4.8,
      reviewCount: 156000,
      priceLevel: 1 as const,
      isOpen: true,
      openingHours: ['Always open'],
      features: ['walking', 'cycling', 'photography', 'views'],
      amenities: ['Walking Path', 'Bike Path', 'Visitor Center'],
      tags: ['iconic', 'photography', 'free', 'must-see'],
      verified: true,
      metadata: { opened: 1937, length: '8980 feet', height: '746 feet' }
    },
    {
      id: 'sf_2',
      name: 'Fisherman\'s Wharf',
      description: 'Popular waterfront area with shops and restaurants',
      category: 'entertainment' as LocationCategory,
      subcategory: 'Waterfront',
      lat: 37.8080,
      lng: -122.4177,
      address: 'Fisherman\'s Wharf',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      rating: 4.1,
      reviewCount: 89400,
      priceLevel: 2 as const,
      isOpen: true,
      openingHours: ['Varies by business'],
      features: ['dining', 'shopping', 'entertainment', 'sea-lions'],
      amenities: ['Restaurants', 'Shops', 'Street Performers', 'Boat Tours'],
      tags: ['tourist', 'seafood', 'family-friendly', 'sea-lions'],
      verified: true,
      metadata: { attractions: ['Pier 39', 'Aquarium of the Bay', 'Sea Lions'] }
    },
    {
      id: 'sf_3',
      name: 'Blue Bottle Coffee',
      description: 'Artisanal coffee roaster and café',
      category: 'restaurant' as LocationCategory,
      subcategory: 'Coffee Shop',
      lat: 37.7849,
      lng: -122.4094,
      address: '66 Mint St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94103',
      rating: 4.3,
      reviewCount: 3200,
      priceLevel: 3 as const,
      isOpen: true,
      openingHours: ['Mon-Fri: 7am-7pm', 'Sat-Sun: 8am-6pm'],
      phone: '+1-510-653-3394',
      website: 'https://bluebottlecoffee.com',
      features: ['wifi', 'takeout', 'outdoor-seating'],
      amenities: ['Artisanal Coffee', 'Pastries', 'WiFi'],
      tags: ['coffee', 'artisanal', 'local', 'wifi'],
      verified: true,
      metadata: { founded: 2002, roasting: 'single-origin' }
    }
  ];

  // Los Angeles locations
  const laLocations = [
    {
      id: 'la_1',
      name: 'Hollywood Walk of Fame',
      description: 'Famous sidewalk with celebrity stars',
      category: 'attraction' as LocationCategory,
      subcategory: 'Entertainment',
      lat: 34.1016,
      lng: -118.3267,
      address: 'Hollywood Blvd',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      rating: 3.9,
      reviewCount: 67800,
      priceLevel: 1 as const,
      isOpen: true,
      openingHours: ['Always accessible'],
      features: ['walking', 'photography', 'free'],
      amenities: ['Celebrity Stars', 'Street Performers', 'Souvenir Shops'],
      tags: ['celebrity', 'hollywood', 'free', 'tourist'],
      verified: true,
      metadata: { stars: 2700, established: 1958 }
    },
    {
      id: 'la_2',
      name: 'Santa Monica Pier',
      description: 'Beachfront amusement park and pier',
      category: 'entertainment' as LocationCategory,
      subcategory: 'Amusement Park',
      lat: 34.0095,
      lng: -118.4977,
      address: '200 Santa Monica Pier',
      city: 'Santa Monica',
      state: 'CA',
      country: 'USA',
      zipCode: '90401',
      rating: 4.4,
      reviewCount: 45600,
      priceLevel: 2 as const,
      isOpen: true,
      openingHours: ['Mon-Thu: 11am-11pm', 'Fri-Sun: 11am-12:30am'],
      website: 'https://santamonicapier.org',
      features: ['rides', 'games', 'dining', 'beach-access'],
      amenities: ['Ferris Wheel', 'Roller Coaster', 'Arcade', 'Restaurants'],
      tags: ['beach', 'family-friendly', 'amusement', 'iconic'],
      verified: true,
      metadata: { opened: 1909, ferris_wheel_height: '85 feet' }
    }
  ];

  // Chicago locations
  const chicagoLocations = [
    {
      id: 'chi_1',
      name: 'Millennium Park',
      description: 'Public park known for Cloud Gate sculpture',
      category: 'park' as LocationCategory,
      subcategory: 'Urban Park',
      lat: 41.8826,
      lng: -87.6226,
      address: '201 E Randolph St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      zipCode: '60602',
      rating: 4.6,
      reviewCount: 78900,
      priceLevel: 1 as const,
      isOpen: true,
      openingHours: ['6am-11pm daily'],
      features: ['art', 'events', 'free', 'photography'],
      amenities: ['Cloud Gate', 'Crown Fountain', 'Concerts', 'Art Installations'],
      tags: ['art', 'free', 'iconic', 'photography'],
      verified: true,
      metadata: { opened: 2004, area: '24.5 acres' }
    },
    {
      id: 'chi_2',
      name: 'Deep Dish Pizza',
      description: 'Authentic Chicago deep dish pizza',
      category: 'restaurant' as LocationCategory,
      subcategory: 'Pizza',
      lat: 41.8781,
      lng: -87.6298,
      address: '123 Chicago Ave',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      rating: 4.3,
      reviewCount: 8900,
      priceLevel: 2 as const,
      isOpen: true,
      openingHours: ['Sun-Thu: 11am-10pm', 'Fri-Sat: 11am-11pm'],
      features: ['dine-in', 'takeout', 'delivery'],
      amenities: ['Deep Dish Pizza', 'Local Beer', 'Family Friendly'],
      tags: ['chicago-style', 'pizza', 'local', 'family'],
      verified: true,
      metadata: { specialty: 'deep dish', established: 1985 }
    }
  ];

  // Gas stations
  const gasStations = [
    {
      id: 'gas_1',
      name: 'Shell Station',
      description: 'Gas station with convenience store',
      category: 'gas' as LocationCategory,
      lat: 40.7580,
      lng: -73.9855,
      address: '1234 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      rating: 3.8,
      reviewCount: 340,
      priceLevel: 2 as const,
      isOpen: true,
      openingHours: ['24/7'],
      features: ['gas', 'convenience-store', 'car-wash', 'atm'],
      amenities: ['Premium Gas', 'Car Wash', 'Convenience Store'],
      tags: ['24-7', 'gas', 'convenience'],
      verified: true,
      metadata: { fuel_types: ['Regular', 'Premium', 'Diesel'] }
    }
  ];

  // Add calculated distances (mock)
  const allLocations = [...nycLocations, ...sfLocations, ...laLocations, ...chicagoLocations, ...gasStations];
  
  allLocations.forEach((location) => {
    // Add missing properties to satisfy TypeScript
    (location as any).distance = Math.random() * 50; // Random distance up to 50 miles
    (location as any).lastUpdated = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
  });

  return allLocations;
};

// Category configurations
const categoryConfig = {
  restaurant: { icon: Utensils, color: '#F59E0B', label: 'Restaurants' },
  hotel: { icon: Building, color: '#3B82F6', label: 'Hotels' },
  shopping: { icon: ShoppingBag, color: '#8B5CF6', label: 'Shopping' },
  entertainment: { icon: Star, color: '#EF4444', label: 'Entertainment' },
  transport: { icon: Car, color: '#6B7280', label: 'Transport' },
  business: { icon: Building, color: '#1F2937', label: 'Business' },
  healthcare: { icon: Heart, color: '#DC2626', label: 'Healthcare' },
  education: { icon: Building, color: '#059669', label: 'Education' },
  service: { icon: Settings, color: '#7C3AED', label: 'Services' },
  attraction: { icon: Star, color: '#F59E0B', label: 'Attractions' },
  park: { icon: MapPin, color: '#10B981', label: 'Parks' },
  gas: { icon: Zap, color: '#F97316', label: 'Gas Stations' },
  parking: { icon: ParkingCircle, color: '#6B7280', label: 'Parking' }
};

// Feature configurations
const featureConfig = {
  wifi: { icon: Wifi, label: 'WiFi' },
  parking: { icon: ParkingCircle, label: 'Parking' },
  'credit-card': { icon: CreditCard, label: 'Credit Cards' },
  takeout: { icon: Coffee, label: 'Takeout' },
  delivery: { icon: Car, label: 'Delivery' },
  'outdoor-seating': { icon: MapPin, label: 'Outdoor Seating' },
  'pet-friendly': { icon: Heart, label: 'Pet Friendly' },
  accessibility: { icon: Users, label: 'Accessible' },
  '24-7': { icon: Clock, label: '24/7' }
};

const LocationFilter: React.FC<LocationFilterProps> = ({
  showControls = true,
  showSearch = true,
  showCategoryFilter = true,
  showRatingFilter = true,
  showPriceFilter = true,
  showDistanceFilter = true,
  showFeatureFilter = true,
  defaultFilters,
  onLocationClick,
  onFilterChange,
  className = '',
  markerSize = 'md',
  maxResults = 100
}) => {
  const locations = useMemo(() => generateMockLocations(), []);
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    rating: 0,
    priceLevel: [1, 2, 3, 4],
    distance: 50,
    isOpen: null,
    features: [],
    searchQuery: '',
    verified: null,
    ...defaultFilters
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter locations based on current filters
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.description?.toLowerCase().includes(query) ||
        location.category.toLowerCase().includes(query) ||
        location.city?.toLowerCase().includes(query) ||
        location.address?.toLowerCase().includes(query) ||
        location.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(location => 
        filters.categories.includes(location.category)
      );
    }

    // Rating
    if (filters.rating > 0) {
      filtered = filtered.filter(location => 
        (location.rating || 0) >= filters.rating
      );
    }

    // Price level
    if (filters.priceLevel.length > 0 && filters.priceLevel.length < 4) {
      filtered = filtered.filter(location => 
        location.priceLevel ? filters.priceLevel.includes(location.priceLevel) : true
      );
    }

    // Distance
    if (filters.distance < 50) {
      filtered = filtered.filter(location => 
        (location.distance || 0) <= filters.distance
      );
    }

    // Open status
    if (filters.isOpen !== null) {
      filtered = filtered.filter(location => 
        location.isOpen === filters.isOpen
      );
    }

    // Features
    if (filters.features.length > 0) {
      filtered = filtered.filter(location =>
        filters.features.every(feature => 
          location.features?.includes(feature) || 
          location.amenities?.some(amenity => 
            amenity.toLowerCase().includes(feature.replace('-', ' '))
          )
        )
      );
    }

    // Verified
    if (filters.verified !== null) {
      filtered = filtered.filter(location => 
        location.verified === filters.verified
      );
    }

    // Limit results
    return filtered.slice(0, maxResults);
  }, [locations, filters, maxResults]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(filteredLocations, updatedFilters);
  }, [filters, filteredLocations, onFilterChange]);

  // Reset filters
  const resetFilters = () => {
    const defaultState: FilterOptions = {
      categories: [],
      rating: 0,
      priceLevel: [1, 2, 3, 4],
      distance: 50,
      isOpen: null,
      features: [],
      searchQuery: '',
      verified: null
    };
    setFilters(defaultState);
  };

  // Export filtered data
  const exportData = () => {
    const exportData = {
      filters,
      locations: filteredLocations,
      timestamp: new Date().toISOString(),
      totalResults: filteredLocations.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `filtered-locations-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get marker size configuration
  const getMarkerSize = () => {
    const sizes = {
      sm: { size: 20, iconSize: 12 },
      md: { size: 24, iconSize: 16 },
      lg: { size: 32, iconSize: 20 }
    };
    return sizes[markerSize];
  };

  const markerConfig = getMarkerSize();

  // Create custom marker icon
  const createMarkerIcon = (location: Location) => {
    const config = categoryConfig[location.category];
    
    const iconHtml = `
      <div style="
        background-color: ${config.color};
        width: ${markerConfig.size}px;
        height: ${markerConfig.size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${markerConfig.iconSize}px;
        position: relative;
      ">
        <svg width="${markerConfig.iconSize}" height="${markerConfig.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${config.icon === Utensils ? '<path d="m3 2 1.578 6.131a.926.926 0 0 0 1.814.445L9 2m-6 0h2m4 0h2m4 0h2l2.5 7M2 17h20l-2 5H4z"/>' :
            config.icon === Building ? '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' :
            config.icon === ShoppingBag ? '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' :
            config.icon === Star ? '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>' :
            config.icon === MapPin ? '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' :
            config.icon === Zap ? '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>' :
            '<circle cx="12" cy="12" r="10"/>'
          }
        </svg>
        ${location.verified ? `
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            background: #10B981;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 1px solid white;
          "></div>
        ` : ''}
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'location-marker',
      iconSize: [markerConfig.size, markerConfig.size],
      iconAnchor: [markerConfig.size / 2, markerConfig.size / 2],
      popupAnchor: [0, -markerConfig.size / 2]
    });
  };

  // Render price level indicator
  const renderPriceLevel = (priceLevel?: number) => {
    if (!priceLevel) return null;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 4 }, (_, i) => (
          <DollarSign
            key={i}
            className={`w-3 h-3 ${
              i < priceLevel ? 'text-green-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Render rating stars
  const renderRating = (rating?: number, reviewCount?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">
          {rating.toFixed(1)} {reviewCount && `(${reviewCount.toLocaleString()})`}
        </span>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Location markers */}
      {filteredLocations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={createMarkerIcon(location)}
          eventHandlers={{
            click: () => {
              onLocationClick?.(location);
            }
          }}
        >
          <Popup className="location-popup">
            <div className="p-3 max-w-xs">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm flex items-center">
                    {location.name}
                    {location.verified && (
                      <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                    )}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">{location.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="px-1 py-0.5 bg-gray-100 rounded">
                      {categoryConfig[location.category].label}
                    </span>
                    {location.subcategory && (
                      <span>{location.subcategory}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating and Price */}
              <div className="flex items-center justify-between mb-2">
                {renderRating(location.rating, location.reviewCount)}
                {renderPriceLevel(location.priceLevel)}
              </div>

              {/* Address */}
              {location.address && (
                <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{location.address}, {location.city}, {location.state}</span>
                </div>
              )}

              {/* Status and Hours */}
              <div className="flex items-center justify-between mb-2">
                {location.isOpen !== undefined && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    location.isOpen ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      location.isOpen ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span>{location.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                )}
                {location.distance && (
                  <span className="text-xs text-gray-500">
                    {location.distance.toFixed(1)} mi away
                  </span>
                )}
              </div>

              {/* Features */}
              {location.features && location.features.length > 0 && (
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {location.features.slice(0, 4).map((feature) => {
                      const featureIcon = featureConfig[feature as keyof typeof featureConfig];
                      return featureIcon ? (
                        <div
                          key={feature}
                          className="flex items-center space-x-1 px-1 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                          title={featureIcon.label}
                        >
                          <featureIcon.icon className="w-2 h-2" />
                          <span>{featureIcon.label}</span>
                        </div>
                      ) : null;
                    })}
                    {location.features.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{location.features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="flex items-center space-x-3 text-xs">
                {location.phone && (
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                )}
                {location.website && (
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Filter Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">Filters</span>
              <span className="text-xs text-gray-500">
                ({filteredLocations.length} results)
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={resetFilters}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={exportData}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Export data"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-1 transition-colors ${
                  isFilterOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } rounded`}
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={filters.searchQuery}
                  onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                  className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => updateFilters({ searchQuery: '' })}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="p-3 space-y-4 max-h-96 overflow-y-auto">
              {/* Categories */}
              {showCategoryFilter && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const isSelected = filters.categories.includes(key as LocationCategory);
                      const Icon = config.icon;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            const newCategories = isSelected
                              ? filters.categories.filter(c => c !== key)
                              : [...filters.categories, key as LocationCategory];
                            updateFilters({ categories: newCategories });
                          }}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-3 h-3" style={{ color: config.color }} />
                          <span>{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rating Filter */}
              {showRatingFilter && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Minimum Rating: {filters.rating === 0 ? 'Any' : filters.rating}⭐
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.rating}
                    onChange={(e) => updateFilters({ rating: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {/* Price Filter */}
              {showPriceFilter && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Price Level
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          const newPriceLevel = filters.priceLevel.includes(level)
                            ? filters.priceLevel.filter(p => p !== level)
                            : [...filters.priceLevel, level];
                          updateFilters({ priceLevel: newPriceLevel });
                        }}
                        className={`flex items-center px-2 py-1 rounded text-xs transition-colors ${
                          filters.priceLevel.includes(level)
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {Array.from({ length: level }, (_, i) => (
                          <DollarSign key={i} className="w-2 h-2" />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Distance Filter */}
              {showDistanceFilter && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Distance: {filters.distance === 50 ? 'Any' : `${filters.distance} miles`}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.distance}
                    onChange={(e) => updateFilters({ distance: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {/* Features Filter */}
              {showFeatureFilter && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(featureConfig).map(([key, config]) => {
                      const isSelected = filters.features.includes(key);
                      const Icon = config.icon;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            const newFeatures = isSelected
                              ? filters.features.filter(f => f !== key)
                              : [...filters.features, key];
                            updateFilters({ features: newFeatures });
                          }}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Filters */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="open-only"
                    checked={filters.isOpen === true}
                    onChange={(e) => updateFilters({ 
                      isOpen: e.target.checked ? true : null 
                    })}
                    className="rounded"
                  />
                  <label htmlFor="open-only" className="text-xs text-gray-700">
                    Open now only
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified-only"
                    checked={filters.verified === true}
                    onChange={(e) => updateFilters({ 
                      verified: e.target.checked ? true : null 
                    })}
                    className="rounded"
                  />
                  <label htmlFor="verified-only" className="text-xs text-gray-700">
                    Verified locations only
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationFilter;