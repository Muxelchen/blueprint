import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const MapLocationsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');

  const locations = [
    { id: 1, name: 'Main Office', address: '123 Business St, NYC', type: 'Office', status: 'Active', coordinates: { lat: 40.7589, lng: -73.9851 }, visits: 1245 },
    { id: 2, name: 'Warehouse North', address: '456 Storage Ave, Brooklyn', type: 'Warehouse', status: 'Active', coordinates: { lat: 40.6892, lng: -73.9442 }, visits: 867 },
    { id: 3, name: 'Store Downtown', address: '789 Retail Rd, Manhattan', type: 'Store', status: 'Active', coordinates: { lat: 40.7505, lng: -73.9934 }, visits: 2156 },
    { id: 4, name: 'Service Center', address: '321 Support Blvd, Queens', type: 'Service', status: 'Inactive', coordinates: { lat: 40.7282, lng: -73.7949 }, visits: 432 },
    { id: 5, name: 'Distribution Hub', address: '654 Logistics Dr, Bronx', type: 'Distribution', status: 'Active', coordinates: { lat: 40.8448, lng: -73.8648 }, visits: 1789 },
  ];

  const locationTypes = ['All', 'Office', 'Warehouse', 'Store', 'Service', 'Distribution'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Location Management
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and monitor all business locations
            </p>
          </div>
          
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <div className="flex items-center space-x-2">
          {locationTypes.map((type) => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm ${
                type === 'All' 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  location.type === 'Office' ? 'bg-blue-100 dark:bg-blue-900' :
                  location.type === 'Warehouse' ? 'bg-green-100 dark:bg-green-900' :
                  location.type === 'Store' ? 'bg-purple-100 dark:bg-purple-900' :
                  location.type === 'Service' ? 'bg-orange-100 dark:bg-orange-900' :
                  'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    location.type === 'Office' ? 'text-blue-600 dark:text-blue-400' :
                    location.type === 'Warehouse' ? 'text-green-600 dark:text-green-400' :
                    location.type === 'Store' ? 'text-purple-600 dark:text-purple-400' :
                    location.type === 'Service' ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {location.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {location.address}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button className={`p-1 rounded ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                location.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {location.status}
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {location.visits} visits
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 btn-secondary text-sm">
                <Eye className="w-3 h-3 mr-1" />
                View
              </button>
              <button className="flex-1 btn-secondary text-sm">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button className={`p-2 rounded ${
                isDarkMode 
                  ? 'text-red-400 hover:bg-red-900/20' 
                  : 'text-red-600 hover:bg-red-50'
              }`}>
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MapLocationsPage; 