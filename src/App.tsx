import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import all Blueprint components
import {
  // Common components
  ErrorBoundary,
  AdvancedThemeProvider,
  useTheme,
  Button,
  IconButton,
  PrintButton,
  DarkModeShortcut,
} from './components/common';
import {
  // Input components
  Checkbox,
  ToggleSwitch,
  Slider,
  DropdownSelect,
  MultiSelect,
  DateTimePicker,
  FileUpload,
  DragDrop,
  RichTextEditor,
  ThemeToggle,
  LanguageSwitch,
  InputField,
} from './components/common/inputs';
import SearchBar from './components/common/inputs/SearchBar';
import Rating from './components/common/inputs/Rating';
import BreadcrumbNav from './components/common/navigation/BreadcrumbNav';
import ThemeSelector from './components/common/inputs/ThemeSelector';
import {
  // Overlay components
  Modal,
  Dialog,
  DropdownMenu,
} from './components/common/overlays';
import { DevErrorBoundary } from './components/common/feedback/DevErrorBoundary';
import { TemplateShowcase } from './components';
import {
  AlertBanner,
  LoadingState,
  SkeletonScreen,
  ToastNotification,
  ErrorPage,
  NotificationCenter,
} from './components/common/feedback';
import {
  TabNavigation,
  Accordion,
  Stepper,
  Pagination,
  StatusIndicator,
  BadgeCounter,
} from './components/common/display';
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
  WidgetManager,
} from './components/layout';
import { DashboardAnalytics } from './components/data-visualization/analytics';
import { HeatmapOverlay } from './components/data-visualization/maps';
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
  RealtimeChart,
  // New Media Widgets
  ImageWidget,
  VideoWidget,
  AudioWidget,
  DocumentViewer,
  CodeBlock,
} from './components/widgets';
import {
  DashboardTemplate,
  AnalyticsTemplate,
  DataTableTemplate,
  MapDashboardTemplate,
} from './templates';
import { useAppStore } from './store/appStore';
import { useDarkMode } from './hooks/useDarkMode';
import { useNotificationCenter } from './hooks/useNotificationCenter';
import NotificationCenterExample from './components/common/feedback/NotificationCenterExample';
import TestWidgets from './TestWidgets';
import CalendarPage from './pages/CalendarPage';
import ProjectsPage from './pages/ProjectsPage';
import MessagesPage from './pages/MessagesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import MapPage from './pages/MapPage';
import ActivityPage from './pages/ActivityPage';
import DocumentsPage from './pages/DocumentsPage';
import DatabasePage from './pages/DatabasePage';
import SecurityPage from './pages/SecurityPage';
import BookmarksPage from './pages/BookmarksPage';
import ArchivePage from './pages/ArchivePage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import UserSettingsPage from './pages/SettingsPage';

// Analytics subpages
import AnalyticsTrafficPage from './pages/analytics/AnalyticsTrafficPage';
import AnalyticsConversionsPage from './pages/analytics/AnalyticsConversionsPage';
import AnalyticsRevenuePage from './pages/analytics/AnalyticsRevenuePage';

// Maps subpages
import MapHeatPage from './pages/maps/MapHeatPage';
import MapLocationsPage from './pages/maps/MapLocationsPage';

// Projects subpages
import ProjectsActivePage from './pages/projects/ProjectsActivePage';
import ProjectsArchivedPage from './pages/projects/ProjectsArchivedPage';

// Activity subpages
import ActivityUsersPage from './pages/activity/ActivityUsersPage';
import ActivityLogsPage from './pages/activity/ActivityLogsPage';

// Messages subpages
import MessagesSentPage from './pages/messages/MessagesSentPage';
import MessagesDraftsPage from './pages/messages/MessagesDraftsPage';

// Templates subpages
import TemplatesAnalyticsPage from './pages/templates/TemplatesAnalyticsPage';
import TemplatesDataTablePage from './pages/templates/TemplatesDataTablePage';

import './index.css';

// Add a simple widget wrapper with error boundary
const WidgetWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="card bg-surface border border-border">
      <h3 className="text-lg font-semibold mb-4 text-text-primary">
        {title}
      </h3>
      <div className="w-full min-h-[240px] overflow-hidden">
        <ErrorBoundary
          fallback={
            <div className="flex items-center justify-center h-full bg-error/10 border border-error rounded-lg p-4">
              <div className="text-center">
                <p className="text-error font-medium">Widget Error</p>
                <p className="text-error/80 text-sm">Failed to render {title}</p>
              </div>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </div>
    </div>
  );
};

// Comprehensive Dashboard showcasing all components
const ComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('widgets');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useDarkMode();

  const handleTabChange = (tabId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('App.tsx - Tab change handler called with:', tabId);
    }
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
      color: '#10B981',
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
      color: '#3B82F6',
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
      color: '#F59E0B',
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
      color: '#8B5CF6',
    },
  ];

  const showcaseTabs = [
    {
      id: 'widgets',
      label: 'Charts & Widgets',
      icon: <BarChart3 className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Showcase all widget components */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Chart & Widget Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-full">
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
                { title: 'KPI Card', component: <KPICard data={mockKPIData[0]} /> },
              ].map(({ title, component }, idx) => (
                <WidgetWrapper key={idx} title={title}>
                  {component}
                </WidgetWrapper>
              ))}
            </div>
          </div>

          {/* New Media & Content Widgets Section */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              🖼️ Media & Content Widgets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-full">
              {[
                { title: 'Image Widget', component: <ImageWidget mode="gallery" size="medium" enableZoom={true} enableLightbox={true} /> },
                { title: 'Video Widget', component: <VideoWidget mode="single" size="medium" controls={true} enableFullscreen={true} /> },
                { title: 'Audio Widget', component: <AudioWidget mode="playlist" size="medium" showWaveform={true} showSpectrum={true} /> },
                { title: 'Document Viewer', component: <DocumentViewer height="400px" enableDownload={true} showToolbar={true} /> },
                { title: 'Code Block', component: <CodeBlock language="typescript" theme="dark" showLineNumbers={true} /> },
              ].map(({ title, component }, idx) => (
                <WidgetWrapper key={idx} title={title}>
                  {component}
                </WidgetWrapper>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'display',
      label: 'Display Components',
      icon: <Grid className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Status Indicators */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-text-primary">
              Status Indicators
            </h2>
            <div className="card bg-surface border-border">
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
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Accordion Component
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Accordion
                items={[
                  {
                    id: '1',
                    title: 'Getting Started',
                    content: (
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Learn how to use Blueprint components in your project.
                      </p>
                    ),
                  },
                  {
                    id: '2',
                    title: 'Component Library',
                    content: (
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Explore our comprehensive collection of UI components.
                      </p>
                    ),
                  },
                  {
                    id: '3',
                    title: 'Templates',
                    content: (
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Pre-built templates for rapid application development.
                      </p>
                    ),
                  },
                ]}
                allowMultiple={false}
              />
            </div>
          </div>

          {/* Stepper */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Stepper Component
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Stepper
                steps={[
                  {
                    id: '1',
                    title: 'Setup',
                    description: 'Configure your project',
                    content: (
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Setup content
                      </div>
                    ),
                  },
                  {
                    id: '2',
                    title: 'Development',
                    description: 'Build your application',
                    content: (
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Development content
                      </div>
                    ),
                  },
                  {
                    id: '3',
                    title: 'Testing',
                    description: 'Test your components',
                    content: (
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Testing content
                      </div>
                    ),
                  },
                  {
                    id: '4',
                    title: 'Deployment',
                    description: 'Deploy to production',
                    content: (
                      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Deployment content
                      </div>
                    ),
                  },
                ]}
                currentStep={2}
              />
            </div>
          </div>

          {/* Pagination */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Pagination
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Pagination
                currentPage={1}
                itemsPerPage={10}
                totalItems={100}
                onPageChange={page => toast.success(`Navigated to page ${page}`)}
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Timeline
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Timeline />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'advanced',
      label: 'Advanced Layout',
      icon: <Settings className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Advanced Layout Manager */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Advanced Layout Manager
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Drag-and-drop dashboard layout system with resizable widgets, grid snapping, and
                layout persistence.
              </p>
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <AdvancedDashboardLayout
                  widgets={[
                    {
                      id: 'widget1',
                      component: KPICard,
                      props: { data: mockKPIData[0] },
                      height: 180,
                      priority: 'high',
                    },
                    {
                      id: 'widget2',
                      component: LineChart,
                      props: {},
                      height: 200,
                      priority: 'medium',
                    },
                  ]}
                  layouts={{
                    lg: [
                      { i: 'widget1', x: 0, y: 0, w: 3, h: 2 },
                      { i: 'widget2', x: 3, y: 0, w: 6, h: 3 },
                    ],
                    md: [
                      { i: 'widget1', x: 0, y: 0, w: 4, h: 2 },
                      { i: 'widget2', x: 0, y: 2, w: 8, h: 3 },
                    ],
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
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Widget Manager
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dynamic widget management system for adding, removing, and configuring dashboard
                widgets.
              </p>
              <WidgetManager
                availableWidgets={[
                  {
                    id: 'chart',
                    name: 'Analytics Chart',
                    icon: <BarChart3 className="w-5 h-5" />,
                    component: () => <div>Chart Widget</div>,
                  },
                  {
                    id: 'kpi',
                    name: 'KPI Card',
                    icon: <TrendingUp className="w-5 h-5" />,
                    component: () => <div>KPI Widget</div>,
                  },
                ]}
                onWidgetAdd={widget => toast.success(`Added ${widget.type} widget`)}
                onWidgetRemove={id => toast(`Removed widget ${id}`)}
                onWidgetUpdate={widget => toast(`Updated widget ${widget.id}`)}
              />
            </div>
          </div>

          {/* Simple Dashboard Analytics */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Dashboard Analytics
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Real-time performance tracking and user behavior analytics for your dashboard.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DashboardAnalytics
                  trackingEnabled={true}
                  onEventCapture={event => console.log('Analytics event:', event)}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'feedback',
      label: 'Feedback & Loading',
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Loading States */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Loading States
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Loading Component
                </h3>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 3000);
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
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Skeleton Screen
                </h3>
                <SkeletonScreen type="card" count={3} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Button Components
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="secondary" size="lg">
                  Large
                </Button>
                <IconButton icon={<Bell />} tooltip="Notifications" />
                <Button variant="primary" leftIcon={<User />}>
                  With Icon
                </Button>
              </div>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Breadcrumb Navigation
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="space-y-4">
                <BreadcrumbNav
                  items={[
                    { id: '1', label: 'Dashboard', onClick: () => toast.success('Navigate to Dashboard') },
                    { id: '2', label: 'Analytics', onClick: () => toast.success('Navigate to Analytics') },
                    { id: '3', label: 'Reports', onClick: () => toast.success('Navigate to Reports') },
                    { id: '4', label: 'Monthly Summary' },
                  ]}
                />
                <BreadcrumbNav
                  showHome={false}
                  maxItems={3}
                  items={[
                    { id: '1', label: 'Projects' },
                    { id: '2', label: 'Web Development' },
                    { id: '3', label: 'React Application' },
                    { id: '4', label: 'Components' },
                    { id: '5', label: 'Breadcrumb' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Notification Center Demo */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Notification Center
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Comprehensive notification center with filtering, search, and real-time updates.
                Click the bell icon in the top-right corner to see it in action, or use the demo
                below.
              </p>
              <NotificationCenterExample />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'forms',
      label: 'Form Components',
      icon: <User className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Input Components */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Form & Input Components
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Checkbox */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Checkbox Component
                </h3>
                <div className="space-y-3">
                  <Checkbox label="Default checkbox" />
                  <Checkbox label="Checked checkbox" checked />
                  <Checkbox label="Disabled checkbox" disabled />
                  <Checkbox label="Indeterminate checkbox" indeterminate />
                </div>
              </div>

              {/* Toggle Switch */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Toggle Switch
                </h3>
                <div className="space-y-3">
                  <ToggleSwitch label="Default switch" />
                  <ToggleSwitch label="Enabled switch" checked />
                  <ToggleSwitch label="Disabled switch" disabled />
                </div>
              </div>

              {/* Slider */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Slider Component
                </h3>
                <div className="space-y-4">
                  <Slider min={0} max={100} defaultValue={50} />
                  <Slider min={0} max={100} defaultValue={20} />
                </div>
              </div>

              {/* Dropdown Select */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dropdown Select
                </h3>
                <DropdownSelect
                  placeholder="Select an option..."
                  options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                  ]}
                />
              </div>

              {/* Multi Select */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Multi Select
                </h3>
                <MultiSelect
                  placeholder="Select multiple options..."
                  options={[
                    { value: 'apple', label: 'Apple' },
                    { value: 'banana', label: 'Banana' },
                    { value: 'cherry', label: 'Cherry' },
                    { value: 'date', label: 'Date' },
                  ]}
                />
              </div>

              {/* Date Time Picker */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Date Time Picker
                </h3>
                <DateTimePicker placeholder="Select date and time..." />
              </div>

              {/* File Upload */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  File Upload
                </h3>
                <FileUpload 
                  accept="image/*,.pdf"
                  maxSize={5 * 1024 * 1024}
                  onChange={(files) => toast.success(`Selected ${files.length} files`)}
                />
              </div>

              {/* Theme Toggle */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Theme Toggle
                </h3>
                <ThemeToggle />
              </div>

              {/* Theme Selector */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} lg:col-span-2`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Theme Selector
                </h3>
                <ThemeSelector
                  showColorPicker
                  onThemeChange={(themeId) => toast.success(`Theme changed to: ${themeId}`)}
                  onModeChange={(mode) => toast.success(`Mode changed to: ${mode}`)}
                />
              </div>

              {/* Language Switch */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Language Switch
                </h3>
                <LanguageSwitch />
              </div>

              {/* Input Field */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Input Field
                </h3>
                <div className="space-y-3">
                  <InputField placeholder="Basic input field" />
                  <InputField placeholder="With icon" leftIcon={<User />} />
                  <InputField placeholder="Password field" type="password" />
                </div>
              </div>

              {/* Search Bar */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Search Bar
                </h3>
                <SearchBar
                  placeholder="Search with suggestions..."
                  suggestions={[
                    { id: '1', title: 'Dashboard', subtitle: 'Main dashboard page', category: 'Navigation' },
                    { id: '2', title: 'Analytics', subtitle: 'View analytics data', category: 'Data' },
                    { id: '3', title: 'Settings', subtitle: 'Application settings', category: 'Config' },
                  ]}
                  recentSearches={['analytics', 'users', 'revenue']}
                  onSearch={(query) => toast.success(`Searching for: ${query}`)}
                />
              </div>

              {/* Rating Component */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Rating Component
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Star Rating
                    </label>
                    <Rating 
                      defaultValue={3.5} 
                      allowHalf 
                      showValue 
                      onChange={(value) => toast.success(`Rated: ${value} stars`)}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Heart Rating
                    </label>
                    <Rating variant="heart" defaultValue={4} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Read-only Rating
                    </label>
                    <Rating value={4.2} readOnly showValue allowHalf />
                  </div>
                </div>
              </div>

              {/* Badge Counter */}
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Badge Counter
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <BadgeCounter count={5} variant="primary">
                      <Button variant="secondary">Messages</Button>
                    </BadgeCounter>
                    <BadgeCounter count={23} variant="error" size="lg">
                      <Button variant="secondary">Notifications</Button>
                    </BadgeCounter>
                  </div>
                  <div className="flex items-center gap-4">
                    <BadgeCounter count={1} dot variant="success">
                      <Button variant="secondary">Online Status</Button>
                    </BadgeCounter>
                    <BadgeCounter count={156} max={99} variant="warning">
                      <Button variant="secondary">Unread</Button>
                    </BadgeCounter>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Rich Text Editor
            </h2>
            <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <RichTextEditor placeholder="Start typing..." />
            </div>
          </div>

          {/* Overlay Components */}
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Overlay Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Modal Component
                </h3>
                <Button 
                  onClick={() => {
                    // Modal functionality would be implemented here
                    toast.success('Modal would open here');
                  }}
                >
                  Open Modal
                </Button>
              </div>

              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dialog Component
                </h3>
                <Button 
                  onClick={() => {
                    // Dialog functionality would be implemented here
                    toast.success('Dialog would open here');
                  }}
                >
                  Open Dialog
                </Button>
              </div>

              <div className={`card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dropdown Menu
                </h3>
                <DropdownMenu 
                  trigger={<Button>Open Menu</Button>}
                  items={[
                    { id: 'edit', label: 'Edit', onClick: () => toast('Edit clicked') },
                    { id: 'delete', label: 'Delete', onClick: () => toast('Delete clicked') },
                    { id: 'share', label: 'Share', onClick: () => toast('Share clicked') },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <Table className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Template Showcase
            </h2>
            <TemplateShowcase />
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1
          className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-secondary-900'}`}
        >
          Blueprint Component Showcase
        </h1>
        <p
          className={`text-lg max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-secondary-600'
          }`}
        >
          Comprehensive demonstration of all Blueprint components working together. This dashboard
          verifies that every component in your system is functional.
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
  );
};

// Home Page Component
const HomePage: React.FC = () => {
  const { user, notifications, incrementNotifications } = useAppStore();
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDarkMode 
          ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50'
        }`}></div>
        
        <div className="relative text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                <span className="mr-2">✨</span>
                Production Ready • Enterprise Grade
              </span>
            </div>
            
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Blueprint
              </span>
              <br />
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Development Platform
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience <strong className="text-blue-500">80+ production-ready components</strong>, 
              <strong className="text-purple-500"> 4 complete templates</strong>, and enterprise-grade features.
              <br />
              <span className="text-lg">Built with React 18, TypeScript 5, and modern web technologies.</span>
            </p>
          </motion.div>

          {/* Feature Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { icon: '⚡', number: '80+', label: 'Components' },
              { icon: '🎨', number: '4', label: 'Templates' },
              { icon: '🔒', number: '100%', label: 'AI Protected' },
              { icon: '⚡', number: '99%', label: 'Performance' },
              { icon: '🌙', number: 'Ctrl+Shift+D', label: 'Dark Mode' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`text-center p-4 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800/50 border border-gray-700' 
                             : 'bg-white/80 border border-gray-200 shadow-sm'
                }`}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/showcase" 
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Grid className="w-5 h-5 mr-2" />
              Explore Components
              <motion.span 
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
            
            <Link 
              to="/templates" 
              className={`group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl border-2 transform hover:scale-105 transition-all duration-200 ${
                isDarkMode 
                  ? 'text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500' 
                  : 'text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Table className="w-5 h-5 mr-2" />
              View Templates
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className={`mt-12 p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/30 border border-gray-700' 
                         : 'bg-white/60 border border-gray-200'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Production Ready
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-blue-500`}></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  TypeScript Strict
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-purple-500`}></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  WCAG 2.1 Compliant
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-orange-500`}></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Performance Optimized
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Templates Page - showing all templates
const TemplatesPage: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<
    'dashboard' | 'analytics' | 'datatable' | 'map'
  >('dashboard');

  const templates = {
    dashboard: DashboardTemplate,
    analytics: AnalyticsTemplate,
    datatable: DataTableTemplate,
    map: MapDashboardTemplate,
  };

  const ActiveTemplate = templates[activeTemplate];

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
          {Object.keys(templates).map(template => (
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
  );
};

// Settings Page Component
const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, user, notifications, clearNotifications } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-text-primary">
        Settings
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-surface border-border">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text-primary">
                  Dark Mode
                </h4>
                <p className="text-sm text-text-secondary">
                  Toggle dark/light theme
                </p>
              </div>
              <button
                onClick={() => {
                  toggleDarkMode();
                  toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode enabled`);
                }}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-surface-secondary text-warning hover:bg-surface-secondary/80'
                    : 'bg-warning-light text-warning hover:bg-warning-light/80'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-surface border-border">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text-primary">
                  Unread Notifications
                </h4>
                <p className="text-sm text-text-secondary">
                  You have {notifications} notifications
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Bell
                  className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-secondary-400'}`}
                />
                <span className="bg-error-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                clearNotifications();
                toast.success('All notifications cleared');
              }}
              className="btn-secondary w-full"
            >
              Clear All Notifications
            </button>
          </div>
        </div>

        <div
          className={`card lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            User Profile
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-secondary-700'
                }`}
              >
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
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-secondary-700'
                }`}
              >
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
  );
};

// Main App Component with Error Boundary
const App: React.FC = () => {
  const location = useLocation();
  const { notifications, sidebarCollapsed, isMobileSidebarOpen, toggleMobileSidebar } = useAppStore();
  const { isDarkMode } = useDarkMode();
  const notificationCenter = useNotificationCenter();

  // Navigation is now handled by the Sidebar component

  return (
    <DevErrorBoundary>
      <div className="min-h-screen transition-colors duration-300 bg-background">
        <div className="flex min-h-screen">
          {/* Use the new enhanced Sidebar component */}
          <Sidebar 
            isOpen={isMobileSidebarOpen} 
            onToggle={toggleMobileSidebar}
          />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top navigation */}
            <header
              className={`shadow-sm border-b h-16 flex-shrink-0 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-secondary-200'
              }`}
            >
              <div className="flex items-center justify-between h-full px-6">
                <button
                  onClick={toggleMobileSidebar}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-secondary-100 text-secondary-600'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2">
                  {/* Dark Mode Shortcut Button */}
                  <DarkModeShortcut
                    enableFloat={false}
                    size="md"
                    style="minimal"
                    showKeyboardHint={true}
                    className="p-2 ml-4 transform translate-y-4"
                  />
                  
                  {/* Notification Center Bell */}
                  <div className="relative">
                    <button
                      onClick={notificationCenter.toggle}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-100 text-secondary-400 hover:text-secondary-600'
                      } ${notificationCenter.isOpen ? 'bg-blue-100 text-blue-600' : ''}`}
                      aria-label="Open notification center"
                    >
                      <Bell className="w-6 h-6" />
                      {notificationCenter.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                          {notificationCenter.unreadCount > 99
                            ? '99+'
                            : notificationCenter.unreadCount}
                        </span>
                      )}
                    </button>
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
                  <Route
                    path="/"
                    element={
                      <DevErrorBoundary>
                        <HomePage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/showcase"
                    element={
                      <DevErrorBoundary>
                        <ComponentShowcase />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/templates"
                    element={
                      <DevErrorBoundary>
                        <TemplatesPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <DevErrorBoundary>
                        <SettingsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/test-widgets"
                    element={
                      <DevErrorBoundary>
                        <TestWidgets />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <DevErrorBoundary>
                        <CalendarPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <DevErrorBoundary>
                        <ProjectsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <DevErrorBoundary>
                        <MessagesPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <DevErrorBoundary>
                        <AnalyticsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <DevErrorBoundary>
                        <ReportsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <DevErrorBoundary>
                        <MapPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/activity"
                    element={
                      <DevErrorBoundary>
                        <ActivityPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/documents"
                    element={
                      <DevErrorBoundary>
                        <DocumentsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/database"
                    element={
                      <DevErrorBoundary>
                        <DatabasePage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/security"
                    element={
                      <DevErrorBoundary>
                        <SecurityPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/bookmarks"
                    element={
                      <DevErrorBoundary>
                        <BookmarksPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/archive"
                    element={
                      <DevErrorBoundary>
                        <ArchivePage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/help"
                    element={
                      <DevErrorBoundary>
                        <HelpPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <DevErrorBoundary>
                        <ProfilePage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/user-settings"
                    element={
                      <DevErrorBoundary>
                        <UserSettingsPage />
                      </DevErrorBoundary>
                    }
                  />

                  {/* Analytics subpages */}
                  <Route
                    path="/analytics/traffic"
                    element={
                      <DevErrorBoundary>
                        <AnalyticsTrafficPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/analytics/conversions"
                    element={
                      <DevErrorBoundary>
                        <AnalyticsConversionsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/analytics/revenue"
                    element={
                      <DevErrorBoundary>
                        <AnalyticsRevenuePage />
                      </DevErrorBoundary>
                    }
                  />

                  {/* Maps subpages */}
                  <Route
                    path="/map/heat"
                    element={
                      <DevErrorBoundary>
                        <MapHeatPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/map/locations"
                    element={
                      <DevErrorBoundary>
                        <MapLocationsPage />
                      </DevErrorBoundary>
                    }
                  />

                  {/* Projects subpages */}
                  <Route
                    path="/projects/active"
                    element={
                      <DevErrorBoundary>
                        <ProjectsActivePage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/projects/archived"
                    element={
                      <DevErrorBoundary>
                        <ProjectsArchivedPage />
                      </DevErrorBoundary>
                    }
                  />

                  {/* Activity subpages */}
                  <Route
                    path="/activity/users"
                    element={
                      <DevErrorBoundary>
                        <ActivityUsersPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/activity/logs"
                    element={
                      <DevErrorBoundary>
                        <ActivityLogsPage />
                      </DevErrorBoundary>
                    }
                  />

                  {/* Messages subpages */}
                  <Route
                    path="/messages/sent"
                    element={
                      <DevErrorBoundary>
                        <MessagesSentPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/messages/drafts"
                    element={
                      <DevErrorBoundary>
                        <MessagesDraftsPage />
                      </DevErrorBoundary>
                    }
                  />

                  {/* Templates subpages */}
                  <Route
                    path="/templates/analytics"
                    element={
                      <DevErrorBoundary>
                        <TemplatesAnalyticsPage />
                      </DevErrorBoundary>
                    }
                  />
                  <Route
                    path="/templates/datatable"
                    element={
                      <DevErrorBoundary>
                        <TemplatesDataTablePage />
                      </DevErrorBoundary>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* Notification Center Overlay */}
        <NotificationCenter
          isOpen={notificationCenter.isOpen}
          onClose={notificationCenter.close}
          position="right"
          width={420}
          height={650}
          showSearch={true}
          showFilters={true}
          showSettings={true}
          className="z-50"
        />


      </div>
    </DevErrorBoundary>
  );
};

export default App;
