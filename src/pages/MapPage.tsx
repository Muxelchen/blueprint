import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, Search, Filter, Layers, Target, Navigation, Zap } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const mockLocations = [
  { id: 1, name: 'New York Office', address: '123 Broadway, NY', lat: 40.7128, lng: -74.0060, type: 'office', status: 'active' },
  { id: 2, name: 'Los Angeles Branch', address: '456 Sunset Blvd, LA', lat: 34.0522, lng: -118.2437, type: 'branch', status: 'active' },
  { id: 3, name: 'Chicago Hub', address: '789 Michigan Ave, Chicago', lat: 41.8781, lng: -87.6298, type: 'hub', status: 'maintenance' },
  { id: 4, name: 'Miami Store', address: '321 Ocean Dr, Miami', lat: 25.7617, lng: -80.1918, type: 'store', status: 'active' },
];

const mapLayers = [
  { id: 'offices', name: 'Offices', enabled: true, color: 'bg-blue-500' },
  { id: 'branches', name: 'Branches', enabled: true, color: 'bg-green-500' },
  { id: 'hubs', name: 'Distribution Hubs', enabled: false, color: 'bg-purple-500' },
  { id: 'stores', name: 'Retail Stores', enabled: true, color: 'bg-orange-500' },
];

const MapPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedLocation, setSelectedLocation] = useState<typeof mockLocations[0] | null>(null);
  const [activeLayers, setActiveLayers] = useState(mapLayers);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleLayer = (layerId: string) => {
    setActiveLayers(layers => 
      layers.map(layer => 
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Interactive Map
            </h1>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Explore locations and geographic data
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <Navigation className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <Target className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <div className={`rounded-lg border overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`} style={{ height: '600px' }}>
            {/* Map Placeholder */}
            <div className={`w-full h-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className="text-center">
                <Map className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Interactive Map View
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Map integration would be displayed here
                </p>
                {/* Mock Map Points */}
                <div className="mt-8 relative">
                  {mockLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer transform transition-transform hover:scale-125 ${
                        location.type === 'office' ? 'bg-blue-500' :
                        location.type === 'branch' ? 'bg-green-500' :
                        location.type === 'hub' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{
                        left: `${20 + index * 80}px`,
                        top: `${20 + Math.sin(index) * 40}px`,
                      }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-current opacity-20 animate-ping"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button className={`p-2 rounded-lg shadow-md transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}>
                <Zap className="w-4 h-4" />
              </button>
              <button className={`p-2 rounded-lg shadow-md transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}>
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Layer Controls */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Map Layers
            </h3>
            <div className="space-y-2">
              {activeLayers.map((layer) => (
                <label key={layer.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => toggleLayer(layer.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className={`w-3 h-3 rounded-full ${layer.color}`}></div>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {layer.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Locations List */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Locations ({filteredLocations.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedLocation?.id === location.id
                      ? 'bg-primary-100 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className={`w-4 h-4 mt-0.5 ${
                      location.type === 'office' ? 'text-blue-500' :
                      location.type === 'branch' ? 'text-green-500' :
                      location.type === 'hub' ? 'text-purple-500' : 'text-orange-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {location.name}
                      </h4>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {location.address}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        location.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {location.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Location Details */}
          {selectedLocation && (
            <div className={`p-4 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Location Details
              </h3>
              <div className="space-y-2">
                <div>
                  <label className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Name
                  </label>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedLocation.name}
                  </p>
                </div>
                <div>
                  <label className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Address
                  </label>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedLocation.address}
                  </p>
                </div>
                <div>
                  <label className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Coordinates
                  </label>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MapPage; 