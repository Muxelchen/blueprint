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
  User,
  Table,
  Grid,
  Activity,
  PieChart,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react'
import toast from 'react-hot-toast'

// Import all Blueprint components
import { 
  // Common components
  ErrorBoundary, 
  AdvancedThemeProvider, 
  useTheme,
  Button, 
  IconButton, 
  PrintButton
} from './components/common'
import { DevErrorBoundary } from './components/common/feedback/DevErrorBoundary'
import { TemplateShowcase } from './components'
import { AlertBanner, LoadingState, SkeletonScreen, ToastNotification, ErrorPage } from './components/common/feedback'
import { TabNavigation, Accordion, Stepper, Pagination, StatusIndicator, BadgeCounter } from './components/common/display'
import { 
  Header, 
  Sidebar, 
  MainContent, 
  // Import updated layout components
  AdvancedDashboardLayout,
  DragDropLayoutManager,
  IntelligentLayoutManager,
  ResponsiveLayoutManager,
  VirtualizedLayoutManager,
  WidgetManager 
} from './components/layout'
import { DashboardAnalytics } from './components/data-visualization/analytics'
import { HeatmapOverlay } from './components/data-visualization/maps'
import { 
  AreaChart, 
  BarChart, 
  DonutChart, 
  LineChart, 
  PieChart as PieChartWidget, 
  KPICard, 
  DataTable,
  Calendar,
  ProgressBar,
  WeatherWidget,
  Heatmap,
  Timeline,
  ScatterPlot,
  Treemap,
  GaugeChart,
  RealtimeChart
} from './components/widgets'
import { DashboardTemplate, AnalyticsTemplate, DataTableTemplate, MapDashboardTemplate } from './templates'
import { useAppStore } from './store/appStore'
import { useDarkMode } from './hooks/useDarkMode'
import './index.css';

// Comprehensive Dashboard showcasing all components
const ComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('widgets')
  const [isLoading, setIsLoading] = useState(false)
  const { isDarkMode } = useDarkMode()
  
  const handleTabChange = (tabId: string) => {
    console.log('App.tsx - Tab change handler called with:', tabId);
    setActiveTab(tabId);
  };
  
  const mockKPIData = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: 124563,
      previousValue: 118200,
      target: 130000,
      unit: '',
      format: 'currency' as const,
      trend: 'up' as const,
      change: 6363, // Added missing change property
      changePercent: 5.3,
      icon: DollarSign,
      color: '#10B981'
    },
    {
      id: 'users',
      title: 'Active Users',
      value: 8549,
      previousValue: 8234,
      target: 10000,
      unit: '',
      format: 'number' as const,
      trend: 'up' as const,
      change: 315, // Added missing change property
      changePercent: 8.6,
      icon: Users,
      color: '#3B82F6'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: 3.24,
      previousValue: 2.98,
      unit: '%',
      format: 'percentage' as const,
      trend: 'down' as const,
      change: -0.26, // Added missing change property
      changePercent: -2.1,
      icon: TrendingUp,
      color: '#F59E0B'
    },
    {
      id: 'performance',
      title: 'Goal Progress',
      value: 87,
      previousValue: 84,
      target: 95,
      unit: '%',
      format: 'percentage' as const,
      trend: 'up' as const,
      change: 3, // Added missing change property
      changePercent: 5.3,
      icon: Target,
      color: '#8B5CF6'
    }
  ]
  
  const showcaseTabs = [
    { 
      id: 'widgets', 
      label: 'Charts & Widgets', 
      icon: <BarChart3 className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Showcase all widget components */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Chart & Widget Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full">
              {[
                { title: 'Area Chart', component: <AreaChart /> },
                { title: 'Bar Chart', component: <BarChart /> },
                { title: 'Donut Chart', component: <DonutChart /> },
                { title: 'Line Chart', component: <LineChart /> },
                { title: 'Pie Chart', component: <PieChartWidget /> },
                { title: 'Gauge Chart', component: <GaugeChart /> },
                { title: 'Realtime Chart', component: <RealtimeChart /> },
                { title: 'Heatmap', component: <Heatmap /> },
                { title: 'Scatter Plot', component: <ScatterPlot /> },
                { title: 'Treemap', component: <Treemap /> },
                { title: 'Timeline', component: <Timeline /> },
                { title: 'Calendar', component: <Calendar /> },
                { title: 'Progress Bar', component: <ProgressBar /> },
                { title: 'Weather Widget', component: <WeatherWidget /> },
                { title: 'Data Table', component: <DataTable /> },
                { title: 'KPI Card', component: <KPICard data={mockKPIData[0]} /> }
              ].map(({ title, component }, idx) => (
                <div key={idx} className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{title}</h3>
                  <div className="w-full min-h-[240px] overflow-hidden">
                    {component}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'display', 
      label: 'Display Components', 
      icon: <Grid className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Status Indicators */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Status Indicators</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="flex flex-wrap gap-4">
                <StatusIndicator status="online" label="Online" />
                <StatusIndicator status="offline" label="Offline" />
                <StatusIndicator status="idle" label="Idle" />
                <StatusIndicator status="busy" label="Busy" />
                <StatusIndicator status="error" label="Error" />
                <StatusIndicator status="maintenance" label="Maintenance" />
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Accordion Component</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Accordion 
                items={[
                  {
                    id: '1',
                    title: 'Getting Started',
                    content: <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Learn how to use Blueprint components in your project.</p>
                  },
                  {
                    id: '2', 
                    title: 'Component Library',
                    content: <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Explore our comprehensive collection of UI components.</p>
                  },
                  {
                    id: '3',
                    title: 'Templates',
                    content: <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Pre-built templates for rapid application development.</p>
                  }
                ]}
                allowMultiple={false}
              />
            </div>
          </div>

          {/* Stepper */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Stepper Component</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Stepper 
                steps={[
                  { id: '1', title: 'Setup', description: 'Configure your project', content: <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Setup content</div> },
                  { id: '2', title: 'Development', description: 'Build your application', content: <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Development content</div> },
                  { id: '3', title: 'Testing', description: 'Test your components', content: <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Testing content</div> },
                  { id: '4', title: 'Deployment', description: 'Deploy to production', content: <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Deployment content</div> }
                ]}
                currentStep={2}
              />
            </div>
          </div>

          {/* Pagination */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Pagination</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Pagination 
                currentPage={1}
                itemsPerPage={10}
                totalItems={100}
                onPageChange={(page) => toast.success(`Navigated to page ${page}`)}
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Timeline</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Timeline />
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'advanced', 
      label: 'Advanced Layout', 
      icon: <Settings className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Advanced Layout Manager */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Advanced Layout Manager</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Drag-and-drop dashboard layout system with resizable widgets, grid snapping, and layout persistence.
              </p>
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <AdvancedDashboardLayout 
                  widgets={[
                    {
                      id: 'widget1',
                      component: KPICard,
                      props: { data: mockKPIData[0] },
                      height: 180,
                      priority: 'high'
                    },
                    {
                      id: 'widget2',
                      component: LineChart,
                      props: {},
                      height: 200,
                      priority: 'medium'
                    }
                  ]}
                  layouts={{
                    lg: [
                      { i: 'widget1', x: 0, y: 0, w: 3, h: 2 },
                      { i: 'widget2', x: 3, y: 0, w: 6, h: 3 }
                    ],
                    md: [
                      { i: 'widget1', x: 0, y: 0, w: 4, h: 2 },
                      { i: 'widget2', x: 0, y: 2, w: 8, h: 3 }
                    ]
                  }}
                  enableVirtualization={true}
                  enableAdvancedDragDrop={true}
                  performanceMode="balanced"
                />
              </div>
            </div>
          </div>

          {/* Widget Manager */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Widget Manager</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Dynamic widget management system for adding, removing, and configuring dashboard widgets.
              </p>
              <WidgetManager
                availableWidgets={[
                  { 
                    id: 'chart', 
                    name: 'Analytics Chart', 
                    icon: <BarChart3 className="w-5 h-5" />,
                    component: () => <div>Chart Widget</div>
                  },
                  { 
                    id: 'kpi', 
                    name: 'KPI Card', 
                    icon: <TrendingUp className="w-5 h-5" />,
                    component: () => <div>KPI Widget</div>
                  }
                ]}
                onWidgetAdd={(widget) => toast.success(`Added ${widget.type} widget`)}
                onWidgetRemove={(id) => toast(`Removed widget ${id}`)}
                onWidgetUpdate={(widget) => toast(`Updated widget ${widget.id}`)}
              />
            </div>
          </div>

          {/* Simple Dashboard Analytics */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Dashboard Analytics</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Real-time performance tracking and user behavior analytics for your dashboard.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DashboardAnalytics 
                  trackingEnabled={true}
                  onEventCapture={(event) => console.log('Analytics event:', event)}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'feedback', 
      label: 'Feedback & Loading', 
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Loading States */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Loading States</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Loading Component</h3>
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => {
                      setIsLoading(true)
                      setTimeout(() => setIsLoading(false), 3000)
                    }}
                  >
                    Trigger Loading
                  </Button>
                </div>
                {isLoading && (
                  <div className="mt-4">
                    <LoadingState message="Loading data..." />
                  </div>
                )}
              </div>
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Skeleton Screen</h3>
                <SkeletonScreen type="card" count={3} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Button Components</h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="secondary" size="lg">Large</Button>
                <IconButton icon={<Bell />} tooltip="Notifications" />
                <Button variant="primary" leftIcon={<User />}>With Icon</Button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'templates', 
      label: 'Templates', 
      icon: <Table className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Template Showcase</h2>
            <TemplateShowcase />
          </div>
        </div>
      )
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-secondary-900'
        }`}>
          Blueprint Component Showcase
        </h1>
        <p className={`text-lg max-w-3xl mx-auto ${
          isDarkMode ? 'text-gray-300' : 'text-secondary-600'
        }`}>
          Comprehensive demonstration of all Blueprint components working together.
          This dashboard verifies that every component in your system is functional.
        </p>
      </div>

      {/* Alert Banner */}
      <AlertBanner
        type="success"
        title="System Status"
        message="All Blueprint components are loaded and functional!"
        dismissible={true}
      />

      {/* Tab Navigation - This handles all content display */}
      <TabNavigation
        tabs={showcaseTabs}
        defaultActiveTab="widgets"
        onTabChange={handleTabChange}
        variant="underline"
      />
    </motion.div>
  )
}

// Home Page Component
const HomePage: React.FC = () => {
  const { user, notifications, incrementNotifications } = useAppStore()
  const { isDarkMode } = useDarkMode()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-secondary-900'
        }`}>
          Welcome to Blueprint Frontend
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${
          isDarkMode ? 'text-gray-300' : 'text-secondary-600'
        }`}>
          A complete React application with TypeScript, Tailwind CSS, and modern tooling.
          Ready for local development with all features included.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          className={`card hover:shadow-xl transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-blue-900' : 'bg-primary-100'
            }`}>
              <User className={`w-6 h-6 ${
                isDarkMode ? 'text-blue-300' : 'text-primary-600'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>User Profile</h3>
          </div>
          <p className={`mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-secondary-600'
          }`}>
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
          className={`card hover:shadow-xl transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-purple-900' : 'bg-accent-100'
            }`}>
              <Grid className={`w-6 h-6 ${
                isDarkMode ? 'text-purple-300' : 'text-accent-600'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Components</h3>
          </div>
          <p className={`mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-secondary-600'
          }`}>
            Explore all Blueprint components in action with live examples.
          </p>
          <Link to="/showcase" className="btn-accent">
            View Components
          </Link>
        </motion.div>

        <motion.div 
          className={`card hover:shadow-xl transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-green-900' : 'bg-success-100'
            }`}>
              <Table className={`w-6 h-6 ${
                isDarkMode ? 'text-green-300' : 'text-success-600'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Templates</h3>
          </div>
          <p className={`mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-secondary-600'
          }`}>
            Ready-to-use templates for rapid application development.
          </p>
          <Link to="/templates" className="btn-secondary">
            View Templates
          </Link>
        </motion.div>
      </div>

      <div className={`card transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
          : 'bg-gradient-to-r from-primary-50 to-accent-50'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Features Included</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-blue-400' : 'bg-primary-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>React 18 with TypeScript</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-blue-400' : 'bg-primary-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Vite for fast development</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-blue-400' : 'bg-primary-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Tailwind CSS with custom theme</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-blue-400' : 'bg-primary-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Framer Motion animations</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-purple-400' : 'bg-accent-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>React Router for navigation</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-purple-400' : 'bg-accent-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Zustand for state management</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-purple-400' : 'bg-accent-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>React Hot Toast notifications</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-purple-400' : 'bg-accent-500'
              }`}></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Recharts & React Leaflet ready</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// Templates Page - showing all templates
const TemplatesPage: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<'dashboard' | 'analytics' | 'datatable' | 'map'>('dashboard')

  const templates = {
    dashboard: DashboardTemplate,
    analytics: AnalyticsTemplate,
    datatable: DataTableTemplate,
    map: MapDashboardTemplate
  }

  const ActiveTemplate = templates[activeTemplate]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Template Gallery</h1>
        <p className="text-lg text-secondary-600">
          Production-ready templates for rapid application development
        </p>
      </div>

      {/* Template Selector */}
      <div className="flex justify-center">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border">
          {Object.keys(templates).map((template) => (
            <button
              key={template}
              onClick={() => setActiveTemplate(template as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTemplate === template
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {template.charAt(0).toUpperCase() + template.slice(1)} Template
            </button>
          ))}
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b bg-gray-50 px-6 py-3">
          <h3 className="text-lg font-semibold">
            {activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Template Preview
          </h3>
        </div>
        <div className="transform scale-75 origin-top-left w-[133.33%] h-screen overflow-auto">
          <ActiveTemplate />
        </div>
      </div>
    </motion.div>
  )
}

// Settings Page Component
const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, user, notifications, clearNotifications } = useAppStore()
  const { isDarkMode: darkModeFromHook } = useDarkMode()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className={`text-3xl font-bold ${
        isDarkMode ? 'text-white' : 'text-secondary-900'
      }`}>Settings</h1>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Dark Mode</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-secondary-600'
                }`}>Toggle dark/light theme</p>
              </div>
              <button
                onClick={() => {
                  toggleDarkMode()
                  toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode enabled`)
                }}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Unread Notifications</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-secondary-600'
                }`}>You have {notifications} notifications</p>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className={`w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-secondary-400'
                }`} />
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

        <div className={`card lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>User Profile</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-secondary-700'
              }`}>
                Name
              </label>
              <input 
                type="text" 
                defaultValue={user?.name}
                className={`input ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-secondary-700'
              }`}>
                Email
              </label>
              <input 
                type="email" 
                defaultValue={user?.email}
                className={`input ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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

// Main App Component with Error Boundary
const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { notifications } = useAppStore()
  const { isDarkMode } = useDarkMode()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Components', href: '/showcase', icon: Grid },
    { name: 'Templates', href: '/templates', icon: Table },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <DevErrorBoundary>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-secondary-50'
      }`}>
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 shadow-xl transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-secondary-200'
          }`}>
            <div className={`flex items-center justify-between h-16 px-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-secondary-200'
            }`}>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-secondary-900'
              }`}>Blueprint</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-secondary-100 text-secondary-600'
                }`}
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
                          ? isDarkMode 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-primary-100 text-primary-700'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
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
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top navigation */}
            <header className={`shadow-sm border-b h-16 flex-shrink-0 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-secondary-200'
            }`}>
              <div className="flex items-center justify-between h-full px-6">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={`md:hidden p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-secondary-100 text-secondary-600'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Bell className={`w-6 h-6 ${
                      isDarkMode ? 'text-gray-400' : 'text-secondary-400'
                    }`} />
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

            {/* Page content with error boundary for individual routes */}
            <main className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <DevErrorBoundary>
                      <HomePage />
                    </DevErrorBoundary>
                  } />
                  <Route path="/showcase" element={
                    <DevErrorBoundary>
                      <ComponentShowcase />
                    </DevErrorBoundary>
                  } />
                  <Route path="/templates" element={
                    <DevErrorBoundary>
                      <TemplatesPage />
                    </DevErrorBoundary>
                  } />
                  <Route path="/settings" element={
                    <DevErrorBoundary>
                      <SettingsPage />
                    </DevErrorBoundary>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </DevErrorBoundary>
  )
}

export default App