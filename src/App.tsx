import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  Map, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon,
  Bell,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'
import { create } from 'zustand'
import DonutChart from './components/widgets/DonutChart'

// Zustand store for global state management
interface AppState {
  isDarkMode: boolean
  user: { name: string; email: string } | null
  notifications: number
  toggleDarkMode: () => void
  setUser: (user: { name: string; email: string } | null) => void
  incrementNotifications: () => void
  clearNotifications: () => void
}

const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  user: { name: 'John Doe', email: 'john@example.com' },
  notifications: 3,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setUser: (user) => set({ user }),
  incrementNotifications: () => set((state) => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 }),
}))

// Home Page Component
const HomePage: React.FC = () => {
  const { user, notifications, incrementNotifications } = useAppStore()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Welcome to Blueprint Frontend
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          A complete React application with TypeScript, Tailwind CSS, and modern tooling.
          Ready for local development with all features included.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          className="card hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold">User Profile</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Welcome back, {user?.name}! You have {notifications} new notifications.
          </p>
          <button 
            onClick={() => {
              incrementNotifications()
              toast.success('New notification added!')
            }}
            className="btn-primary"
          >
            Add Notification
          </button>
        </motion.div>

        <motion.div 
          className="card hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold">Analytics</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            View your data with interactive charts powered by Recharts.
          </p>
          <Link to="/analytics" className="btn-accent">
            View Analytics
          </Link>
        </motion.div>

        <motion.div 
          className="card hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <Map className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold">Map View</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Explore interactive maps with React Leaflet integration.
          </p>
          <Link to="/map" className="btn-secondary">
            Open Map
          </Link>
        </motion.div>
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-accent-50">
        <h2 className="text-2xl font-bold mb-4">Features Included</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>React 18 with TypeScript</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Vite for fast development</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Tailwind CSS with custom theme</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Framer Motion animations</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span>React Router for navigation</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span>Zustand for state management</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span>React Hot Toast notifications</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span>Recharts & React Leaflet ready</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// Analytics Page Component (with Recharts example)
const AnalyticsPage: React.FC = () => {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Analytics Dashboard</h1>
      
      {/* DonutChart without extra card wrapper */}
      <DonutChart />
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Monthly Data</h3>
          <div className="bg-secondary-50 p-4 rounded-lg">
            <p className="text-secondary-600 text-center mb-4">
              Monthly performance overview
            </p>
            <div className="space-y-2">
              {data.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="bg-primary-500 h-2 rounded transition-all duration-300"
                      style={{ width: `${Math.max((item.value / 800) * 80, 10)}px` }}
                    ></div>
                    <span className="text-sm text-secondary-600 min-w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg">
              <span className="font-medium text-sm">Total Users</span>
              <span className="text-xl font-bold text-success-600">1,234</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-warning-50 rounded-lg">
              <span className="font-medium text-sm">Active Sessions</span>
              <span className="text-xl font-bold text-warning-600">456</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-error-50 rounded-lg">
              <span className="font-medium text-sm">Bounce Rate</span>
              <span className="text-xl font-bold text-error-600">12%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Map Page Component (React Leaflet placeholder)
const MapPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-secondary-900">Interactive Map</h1>
      
      <div className="card">
        <div className="bg-secondary-100 h-96 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <p className="text-lg text-secondary-600">React Leaflet Map Component</p>
            <p className="text-secondary-500">Map would render here with full functionality</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Map Controls</h3>
          <div className="space-y-2">
            <button className="btn-primary w-full">Center Map</button>
            <button className="btn-secondary w-full">Add Marker</button>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Layers</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="form-checkbox" />
              <span>Streets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Satellite</span>
            </label>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Coordinates</h3>
          <p className="text-sm text-secondary-600">
            Lat: 40.7128<br />
            Lng: -74.0060
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Settings Page Component
const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, user, notifications, clearNotifications } = useAppStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-secondary-600">Toggle dark/light theme</p>
              </div>
              <button
                onClick={() => {
                  toggleDarkMode()
                  toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode enabled`)
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-secondary-800 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Unread Notifications</h4>
                <p className="text-sm text-secondary-600">You have {notifications} notifications</p>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-secondary-400" />
                <span className="bg-error-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications}
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                clearNotifications()
                toast.success('All notifications cleared')
              }}
              className="btn-secondary w-full"
            >
              Clear All Notifications
            </button>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">User Profile</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Name
              </label>
              <input 
                type="text" 
                defaultValue={user?.name}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                defaultValue={user?.email}
                className="input"
              />
            </div>
            <div className="md:col-span-2">
              <button 
                onClick={() => toast.success('Profile updated successfully!')}
                className="btn-primary"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main App Component
const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { notifications } = useAppStore()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="h-screen bg-secondary-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
            <h1 className="text-xl font-bold text-secondary-900">Blueprint</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.name === 'Settings' && notifications > 0 && (
                      <span className="ml-auto bg-error-500 text-white text-xs px-2 py-1 rounded-full">
                        {notifications}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="bg-white shadow-sm border-b border-secondary-200 h-16">
            <div className="flex items-center justify-between h-full px-6">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="w-6 h-6 text-secondary-400" />
                  {notifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-error-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {notifications}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App