import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BarChart3,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  User,
  Activity,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';

// Import Blueprint components
import { KPICard, BarChart, PieChart, DataTable } from './components/widgets';
import './index.css';

// Sample data for charts (enhanced with Blueprint styling)
const salesData = [
  { name: 'Jan', sales: 4000, profit: 2400, revenue: 6400 },
  { name: 'Feb', sales: 3000, profit: 1398, revenue: 4398 },
  { name: 'Mar', sales: 2000, profit: 9800, revenue: 11800 },
  { name: 'Apr', sales: 2780, profit: 3908, revenue: 6688 },
  { name: 'May', sales: 1890, profit: 4800, revenue: 6690 },
  { name: 'Jun', sales: 2390, profit: 3800, revenue: 6190 },
];

const userStats = [
  { name: 'Desktop', value: 400, color: '#3b82f6' },
  { name: 'Mobile', value: 300, color: '#10b981' },
  { name: 'Tablet', value: 200, color: '#f59e0b' },
];

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
    change: 6363,
    changePercent: 5.3,
    icon: DollarSign,
    color: '#10B981',
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 2847,
    previousValue: 2634,
    target: 3000,
    unit: '',
    format: 'number' as const,
    trend: 'up' as const,
    change: 213,
    changePercent: 8.1,
    icon: Users,
    color: '#3B82F6',
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: 3.24,
    previousValue: 3.31,
    unit: '%',
    format: 'percentage' as const,
    trend: 'down' as const,
    change: -0.07,
    changePercent: -2.1,
    icon: Target,
    color: '#EF4444',
  },
  {
    id: 'performance',
    title: 'Performance',
    value: 89.32,
    previousValue: 84.21,
    unit: '',
    format: 'currency' as const,
    trend: 'up' as const,
    change: 5.11,
    changePercent: 6.1,
    icon: TrendingUp,
    color: '#8B5CF6',
  },
];

const TaskCard: React.FC<{ title: string; status: 'pending' | 'completed' | 'in-progress'; priority: 'high' | 'medium' | 'low' }> = 
  ({ title, status, priority }) => (
    <motion.div 
      className="card p-4 border-l-4 border-primary hover:shadow-md transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-text-primary font-medium">{title}</h4>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            priority === 'high' ? 'bg-error/10 text-error' :
            priority === 'medium' ? 'bg-warning/10 text-warning' :
            'bg-success/10 text-success'
          }`}>
            {priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'completed' ? 'bg-success/10 text-success' :
            status === 'in-progress' ? 'bg-info/10 text-info' :
            'bg-muted-foreground/10 text-muted-foreground'
          }`}>
            {status}
          </span>
        </div>
      </div>
    </motion.div>
  );

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'tasks', name: 'Tasks', icon: Activity },
    { id: 'team', name: 'Team', icon: Users },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Blueprint Dashboard</h1>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              M
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 768) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-surface/95 backdrop-blur"
            >
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* KPI Cards */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockKPIData.map((kpi) => (
                      <KPICard 
                        key={kpi.id} 
                        data={kpi} 
                        size="medium"
                        animate={true}
                      />
                    ))}
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sales Chart */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Performance</h3>
                                         <BarChart 
                       data={salesData}
                       height={300}
                     />
                  </div>

                  {/* User Device Stats */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">User Distribution</h3>
                                         <PieChart 
                       data={userStats}
                       height={300}
                     />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-foreground">New user registration: john@example.com</span>
                      <span className="text-sm text-muted-foreground ml-auto">2 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <span className="text-foreground">Order #1234 completed successfully</span>
                      <span className="text-sm text-muted-foreground ml-auto">5 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-foreground">System backup completed</span>
                      <span className="text-sm text-muted-foreground ml-auto">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
                
                {/* Trend Chart */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Performance Trends</h3>
                                     <BarChart 
                     data={salesData}
                     height={400}
                   />
                </div>

                {/* Additional Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Growth Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Revenue Growth</span>
                        <span className="text-success font-medium">+12.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">User Growth</span>
                        <span className="text-success font-medium">+8.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Conversion Rate</span>
                        <span className="text-error font-medium">-2.1%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        📈 Revenue is trending upward with strong Q2 performance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        👥 User engagement has increased by 15% this month
                      </p>
                      <p className="text-sm text-muted-foreground">
                        🎯 Conversion rates need attention in mobile segment
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground">Task Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Pending</h3>
                    <TaskCard title="Review Q2 Reports" status="pending" priority="high" />
                    <TaskCard title="Update Dashboard Metrics" status="pending" priority="medium" />
                    <TaskCard title="Plan Team Meeting" status="pending" priority="low" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">In Progress</h3>
                    <TaskCard title="Implement New Features" status="in-progress" priority="high" />
                    <TaskCard title="Fix UI Bugs" status="in-progress" priority="medium" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Completed</h3>
                    <TaskCard title="Deploy Version 2.1" status="completed" priority="high" />
                    <TaskCard title="Update Documentation" status="completed" priority="low" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground">Team Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card p-6 text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                      JD
                    </div>
                    <h3 className="font-semibold text-foreground">John Doe</h3>
                    <p className="text-muted-foreground text-sm">Frontend Developer</p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">React</span>
                      <span className="px-2 py-1 bg-info/10 text-info text-xs rounded-full">TypeScript</span>
                    </div>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-lg mx-auto mb-4">
                      JS
                    </div>
                    <h3 className="font-semibold text-foreground">Jane Smith</h3>
                    <p className="text-muted-foreground text-sm">Backend Developer</p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">Node.js</span>
                      <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">Python</span>
                    </div>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg mx-auto mb-4">
                      MB
                    </div>
                    <h3 className="font-semibold text-foreground">Mike Brown</h3>
                    <p className="text-muted-foreground text-sm">UI/UX Designer</p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Figma</span>
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Design</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App; 