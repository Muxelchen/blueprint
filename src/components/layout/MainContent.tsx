import React from 'react'
import { motion } from 'framer-motion'

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

interface WidgetAreaProps {
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  variant?: 'default' | 'gradient' | 'bordered' | 'minimal'
}

// Widget Area Component
const WidgetArea: React.FC<WidgetAreaProps> = ({ 
  title, 
  children, 
  className = '', 
  size = 'medium',
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3',
    full: 'col-span-full'
  }

  const variantClasses = {
    default: 'bg-white border border-secondary-200 shadow-sm',
    gradient: 'bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200',
    bordered: 'bg-white border-2 border-primary-200',
    minimal: 'bg-white'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg p-6 hover:shadow-md transition-shadow duration-200
        ${className}
      `}
    >
      {title && (
        <div className="mb-4 pb-2 border-b border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
        </div>
      )}
      {children}
    </motion.div>
  )
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType<any>
}> = ({ title, value, change, trend = 'neutral', icon: Icon }) => {
  const trendColors = {
    up: 'text-success-600',
    down: 'text-error-600',
    neutral: 'text-secondary-600'
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-secondary-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-secondary-600">{title}</h4>
        {Icon && (
          <div className="p-2 bg-primary-100 rounded-lg">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-secondary-900">{value}</p>
        {change && (
          <p className={`text-sm ${trendColors[trend]}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  )
}

// Quick Actions Component
const QuickActions: React.FC = () => {
  const actions = [
    { label: 'New Project', color: 'bg-primary-500', onClick: () => {} },
    { label: 'Upload File', color: 'bg-accent-500', onClick: () => {} },
    { label: 'Create Report', color: 'bg-success-500', onClick: () => {} },
    { label: 'Send Message', color: 'bg-warning-500', onClick: () => {} }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className={`${action.color} text-white p-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  )
}

// Activity Feed Component
const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'created a new project',
      target: 'Website Redesign',
      time: '2 minutes ago',
      avatar: 'JD'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      action: 'uploaded a file to',
      target: 'Marketing Campaign',
      time: '15 minutes ago',
      avatar: 'SW'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'completed task',
      target: 'Database Migration',
      time: '1 hour ago',
      avatar: 'MJ'
    }
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
        >
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {activity.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-secondary-900">
              <span className="font-medium">{activity.user}</span>
              {' '}
              <span className="text-secondary-600">{activity.action}</span>
              {' '}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Chart Placeholder Component
const ChartPlaceholder: React.FC<{ title: string; height?: string }> = ({ 
  title, 
  height = 'h-64' 
}) => {
  return (
    <div className={`${height} bg-secondary-50 rounded-lg flex items-center justify-center border-2 border-dashed border-secondary-300`}>
      <div className="text-center">
        <div className="w-12 h-12 bg-secondary-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-secondary-600">{title}</p>
        <p className="text-xs text-secondary-500 mt-1">Chart component will render here</p>
      </div>
    </div>
  )
}

// Main Content Component
const MainContent: React.FC<MainContentProps> = ({ children, className = '' }) => {
  return (
    <main className={`flex-1 p-6 bg-secondary-50 min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Default Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children}
        </div>
      </div>
    </main>
  )
}

// Dashboard Grid Component
const DashboardGrid: React.FC = () => {
  return (
    <MainContent>
      {/* Stats Row */}
      <WidgetArea size="small" variant="default">
        <StatsCard 
          title="Total Users" 
          value="12,345" 
          change="+12% from last month"
          trend="up"
        />
      </WidgetArea>

      <WidgetArea size="small" variant="default">
        <StatsCard 
          title="Revenue" 
          value="$54,321" 
          change="+8% from last month"
          trend="up"
        />
      </WidgetArea>

      <WidgetArea size="small" variant="default">
        <StatsCard 
          title="Orders" 
          value="1,234" 
          change="-3% from last month"
          trend="down"
        />
      </WidgetArea>

      <WidgetArea size="small" variant="default">
        <StatsCard 
          title="Conversion" 
          value="3.2%" 
          change="No change"
          trend="neutral"
        />
      </WidgetArea>

      {/* Charts Row */}
      <WidgetArea title="Revenue Analytics" size="large" variant="default">
        <ChartPlaceholder title="Revenue Chart" />
      </WidgetArea>

      <WidgetArea title="Quick Actions" size="small" variant="gradient">
        <QuickActions />
      </WidgetArea>

      {/* Content Row */}
      <WidgetArea title="Recent Activity" size="medium" variant="default">
        <ActivityFeed />
      </WidgetArea>

      <WidgetArea title="Performance Metrics" size="medium" variant="bordered">
        <ChartPlaceholder title="Performance Chart" height="h-48" />
      </WidgetArea>

      {/* Full Width Row */}
      <WidgetArea title="Detailed Analytics" size="full" variant="minimal">
        <div className="grid md:grid-cols-2 gap-6">
          <ChartPlaceholder title="Traffic Sources" />
          <ChartPlaceholder title="User Engagement" />
        </div>
      </WidgetArea>
    </MainContent>
  )
}

// Export components
export default MainContent
export { WidgetArea, StatsCard, QuickActions, ActivityFeed, ChartPlaceholder, DashboardGrid }