import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ChevronRight, 
  Home, 
  BarChart3, 
  Map, 
  Settings, 
  User,
  Calendar,
  FileText,
  Archive,
  Layers,
  Activity,
  Clock
} from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<any>
  isActive?: boolean
}

interface EllipsisItem {
  label: string
  href: string
  isEllipsis: true
}

type BreadcrumbDisplayItem = BreadcrumbItem | EllipsisItem

interface BreadcrumbNavProps {
  className?: string
  showHome?: boolean
  maxItems?: number
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ 
  className = '', 
  showHome = true, 
  maxItems = 4 
}) => {
  const location = useLocation()
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<BreadcrumbItem[]>([])
  
  // Icon mapping for different routes
  const iconMap: Record<string, React.ComponentType<any>> = {
    '/': Home,
    '/analytics': BarChart3,
    '/map': Map,
    '/settings': Settings,
    '/profile': User,
    '/calendar': Calendar,
    '/documents': FileText,
    '/archive': Archive,
    '/projects': Layers,
    '/activity': Activity
  }

  // Route name mapping
  const routeNames: Record<string, string> = {
    '/': 'Dashboard',
    '/analytics': 'Analytics',
    '/analytics/traffic': 'Traffic Analytics',
    '/analytics/conversions': 'Conversion Analytics',
    '/analytics/revenue': 'Revenue Analytics',
    '/map': 'Interactive Map',
    '/map/heat': 'Heat Maps',
    '/map/locations': 'Locations',
    '/settings': 'Settings',
    '/profile': 'User Profile',
    '/calendar': 'Calendar',
    '/documents': 'Documents',
    '/archive': 'Archive',
    '/projects': 'Projects',
    '/projects/active': 'Active Projects',
    '/projects/archived': 'Archived Projects',
    '/activity': 'Activity Feed',
    '/activity/users': 'User Activity',
    '/activity/logs': 'System Logs',
    '/messages': 'Messages',
    '/messages/sent': 'Sent Messages',
    '/messages/drafts': 'Draft Messages',
    '/help': 'Help & Support',
    '/security': 'Security',
    '/database': 'Database',
    '/bookmarks': 'Bookmarks'
  }

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Add home if requested
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: Home,
        isActive: pathname === '/'
      })
    }

    // Build breadcrumbs from path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      // Get route name or format segment
      const label = routeNames[currentPath] || 
                   segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      
      breadcrumbs.push({
        label,
        href: currentPath,
        icon: iconMap[currentPath],
        isActive: isLast
      })
    })

    return breadcrumbs
  }

  // Update breadcrumbs when location changes
  useEffect(() => {
    const newBreadcrumbs = generateBreadcrumbs(location.pathname)
    setBreadcrumbHistory(newBreadcrumbs)
  }, [location.pathname, showHome])

  // Truncate breadcrumbs if too many
  const displayBreadcrumbs: BreadcrumbDisplayItem[] = breadcrumbHistory.length > maxItems
    ? [
        ...breadcrumbHistory.slice(0, 1),
        { label: '...', href: '#', isEllipsis: true as const },
        ...breadcrumbHistory.slice(-maxItems + 2)
      ]
    : breadcrumbHistory

  // Get page title from current breadcrumb
  const currentPageTitle = breadcrumbHistory[breadcrumbHistory.length - 1]?.label || 'Page'

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      {/* Page Title (mobile) */}
      <div className="sm:hidden">
        <h1 className="text-lg font-semibold text-secondary-900">
          {currentPageTitle}
        </h1>
      </div>

      {/* Full Breadcrumb (desktop) */}
      <div className="hidden sm:flex items-center space-x-1">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1
          const isEllipsis = 'isEllipsis' in item && item.isEllipsis

          return (
            <motion.div
              key={`${item.href}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center"
            >
              {isEllipsis ? (
                <span className="px-2 py-1 text-secondary-400">...</span>
              ) : (
                <>
                  {isLast ? (
                    <span className="flex items-center px-2 py-1 rounded-lg bg-primary-50 text-primary-700 font-medium">
                      {'icon' in item && item.icon && <item.icon className="w-4 h-4 mr-1.5" />}
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center px-2 py-1 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
                    >
                      {'icon' in item && item.icon && <item.icon className="w-4 h-4 mr-1.5" />}
                      {item.label}
                    </Link>
                  )}
                </>
              )}

              {!isLast && (
                <ChevronRight className="w-4 h-4 text-secondary-400 mx-1 flex-shrink-0" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Navigation History (desktop only) */}
      <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-secondary-200">
        <div className="flex items-center space-x-2 text-xs text-secondary-500">
          <Clock className="w-3 h-3" />
          <span>Last visited: {new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ml-auto flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
          title="Go back"
          onClick={() => window.history.back()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
          title="Go forward"
          onClick={() => window.history.forward()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
          title="Refresh page"
          onClick={() => window.location.reload()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      </div>
    </nav>
  )
}

export default BreadcrumbNav