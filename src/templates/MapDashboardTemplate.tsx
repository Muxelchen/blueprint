import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, Navigation, Layers, Search, Filter, Download, Settings } from 'lucide-react';
import { Button } from '../components/common';

// Map-focused template with location data, markers, and geospatial analytics
export const MapDashboardTemplate: React.FC = () => {
  const [activeView, setActiveView] = useState('satellite');
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const locations = [
    { id: 1, name: 'Downtown Office', lat: 37.7749, lng: -122.4194, type: 'office', status: 'active' },
    { id: 2, name: 'Warehouse North', lat: 37.8044, lng: -122.2712, type: 'warehouse', status: 'active' },
    { id: 3, name: 'Store Location A', lat: 37.7849, lng: -122.4094, type: 'store', status: 'maintenance' },
    { id: 4, name: 'Distribution Center', lat: 37.7649, lng: -122.4294, type: 'distribution', status: 'active' },
  ];

  const mapStats = [
    { title: 'Total Locations', value: '24', change: '+3 this month' },
    { title: 'Active Routes', value: '12', change: '85% efficiency' },
    { title: 'Coverage Area', value: '450 km²', change: '+12% expansion' },
    { title: 'Deliveries Today', value: '156', change: '+23% vs yesterday' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-gray-900 flex items-center">
              <Map className="w-6 h-6 mr-2" />
              Location Dashboard
            </h1>
            <p className="text-sm text-gray-600">Real-time location tracking and geospatial analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" leftIcon={<Filter />}>Filter</Button>
            <Button variant="outline" size="sm" leftIcon={<Download />}>Export Data</Button>
            <Button variant="outline" size="sm" leftIcon={<Settings />}>Map Settings</Button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Map Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Map View</h3>
              <div className="grid grid-cols-2 gap-2">
                {['satellite', 'street', 'terrain', 'traffic'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      activeView === view
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Location List */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Locations ({locations.length})</h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    isSelected={selectedLocation === location.id}
                    onClick={() => setSelectedLocation(location.id)}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Quick Stats</h3>
              {mapStats.map((stat, index) => (
                <div key={stat.title} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.title}</div>
                  <div className="text-xs text-green-600">{stat.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Map Container */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            {/* Map Placeholder */}
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="text-center">
                <Map className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h3>
                <p className="text-gray-500 max-w-md">
                  Your interactive map component (Leaflet, Google Maps, or Mapbox) would render here.
                  This template provides the perfect layout and controls for any mapping solution.
                </p>
              </div>

              {/* Sample Markers */}
              <div className="absolute top-1/4 left-1/3">
                <MapMarker type="office" />
              </div>
              <div className="absolute top-1/2 left-1/2">
                <MapMarker type="warehouse" />
              </div>
              <div className="absolute top-3/4 right-1/3">
                <MapMarker type="store" />
              </div>
            </div>

            {/* Map Overlay Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white rounded-lg shadow-lg p-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Layers className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
              <div className="space-y-1">
                <LegendItem color="blue" label="Offices" />
                <LegendItem color="green" label="Warehouses" />
                <LegendItem color="purple" label="Stores" />
                <LegendItem color="orange" label="Distribution" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            {selectedLocation ? (
              <LocationDetails locationId={selectedLocation} locations={locations} />
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
                
                {/* Heat Map */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Activity Heat Map</h4>
                  <div className="h-32 bg-gradient-to-r from-blue-200 via-green-200 to-red-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-sm">Heat map visualization</span>
                  </div>
                </div>

                {/* Route Optimization */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Route Efficiency</h4>
                  <div className="space-y-2">
                    <RouteEfficiency route="Route A" efficiency={85} />
                    <RouteEfficiency route="Route B" efficiency={92} />
                    <RouteEfficiency route="Route C" efficiency={78} />
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-3">
                    <ActivityItem activity="New delivery completed" location="Store Location A" time="2 min ago" />
                    <ActivityItem activity="Route optimized" location="Warehouse North" time="15 min ago" />
                    <ActivityItem activity="Maintenance scheduled" location="Distribution Center" time="1 hour ago" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationCard: React.FC<{
  location: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ location, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={onClick}
    className={`p-3 rounded-lg border cursor-pointer transition-all ${
      isSelected
        ? 'bg-blue-50 border-blue-300'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-900">{location.name}</span>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {location.status}
      </span>
    </div>
    <div className="text-xs text-gray-500 mt-1">{location.type}</div>
  </motion.div>
);

const MapMarker: React.FC<{ type: string }> = ({ type }) => {
  const colors: Record<string, string> = {
    office: 'bg-blue-500',
    warehouse: 'bg-green-500',
    store: 'bg-purple-500',
    distribution: 'bg-orange-500'
  };

  return (
    <div className={`w-6 h-6 ${colors[type] || 'bg-gray-500'} rounded-full shadow-lg border-2 border-white animate-pulse`}>
      <div className="w-full h-full rounded-full bg-white opacity-30"></div>
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

const LocationDetails: React.FC<{ locationId: any; locations: any[] }> = ({ locationId, locations }) => {
  const location = locations.find(l => l.id === locationId);
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{location?.name}</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Type</label>
          <p className="text-sm text-gray-900">{location?.type}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <p className="text-sm text-gray-900">{location?.status}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Coordinates</label>
          <p className="text-sm text-gray-900">{location?.lat}, {location?.lng}</p>
        </div>
        <Button size="sm" className="w-full">View Details</Button>
      </div>
    </div>
  );
};

const RouteEfficiency: React.FC<{ route: string; efficiency: number }> = ({ route, efficiency }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{route}</span>
      <span className="text-gray-900">{efficiency}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-green-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${efficiency}%` }}
      />
    </div>
  </div>
);

const ActivityItem: React.FC<{ activity: string; location: string; time: string }> = ({ activity, location, time }) => (
  <div className="border-l-2 border-blue-500 pl-3">
    <p className="text-sm font-medium text-gray-900">{activity}</p>
    <p className="text-xs text-gray-500">{location} • {time}</p>
  </div>
);

export default MapDashboardTemplate;