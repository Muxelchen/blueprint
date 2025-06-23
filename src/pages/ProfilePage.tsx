import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const ProfilePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Developer',
    department: 'Engineering',
    joinDate: '2022-03-15',
    bio: 'Passionate developer with 8+ years of experience in full-stack development.',
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Projects Completed', value: 24 },
    { label: 'Team Members', value: 8 },
    { label: 'Years Experience', value: 8 },
    { label: 'Skills Mastered', value: 15 },
  ];

  const recentActivity = [
    { action: 'Updated profile photo', date: '2 hours ago' },
    { action: 'Completed project milestone', date: '1 day ago' },
    { action: 'Joined new team', date: '3 days ago' },
    { action: 'Updated skills section', date: '1 week ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className={`p-8 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-sm mb-6`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <User className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <button className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                } transition-colors`}>
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className={`text-2xl font-bold border-b-2 border-primary-500 bg-transparent ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } focus:outline-none`}
                  />
                ) : (
                  <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile.name}
                  </h1>
                )}
                
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.title}
                    onChange={(e) => setEditedProfile({ ...editedProfile, title: e.target.value })}
                    className={`text-lg border-b border-gray-300 bg-transparent ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    } focus:outline-none mt-2`}
                  />
                ) : (
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profile.title}
                  </p>
                )}
                
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {profile.department} • Joined {new Date(profile.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleEdit} className="btn-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className={`flex-1 p-2 rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {profile.email}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className={`flex-1 p-2 rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {profile.phone}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      className={`flex-1 p-2 rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                About
              </h3>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  rows={4}
                  className={`w-full p-3 rounded border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  } resize-none`}
                />
              ) : (
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Statistics
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      index === 0 ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {activity.action}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 