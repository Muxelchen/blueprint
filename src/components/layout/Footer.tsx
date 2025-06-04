import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  Shield,
  Globe,
  Wifi,
  Server
} from 'lucide-react'

const Footer: React.FC = () => {
  // Mock system status
  const systemStatus = {
    api: 'operational',
    database: 'operational',
    cdn: 'operational',
    monitoring: 'operational'
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-success-500'
      case 'degraded': return 'bg-warning-500'
      case 'outage': return 'bg-error-500'
      default: return 'bg-secondary-400'
    }
  }

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'Changelog', href: '/changelog' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Status Page', href: '/status' },
      { name: 'System Health', href: '/health' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Security', href: '/security' }
    ]
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com', color: 'hover:text-gray-900' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-600' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@example.com', color: 'hover:text-primary-600' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-secondary-200 mt-auto">
      {/* System Status Bar */}
      <div className="bg-secondary-50 border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-secondary-600" />
                <span className="text-sm font-medium text-secondary-900">System Status</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {Object.entries(systemStatus).map(([service, status]) => (
                  <div key={service} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${statusColor(status)}`}></div>
                    <span className="text-xs text-secondary-600 capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-secondary-600">
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-1">
                <Server className="w-3 h-3" />
                <span>Low Latency</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">Blueprint</span>
            </div>
            
            <p className="text-secondary-600 mb-6 max-w-md">
              Building the future of modern web applications with cutting-edge technology 
              and intuitive design. Empowering developers and businesses worldwide.
            </p>
            
            <div className="space-y-2 text-sm text-secondary-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA 94102</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@blueprint.com</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-secondary-600 hover:text-primary-600 transition-colors text-sm flex items-center group"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Stay updated
              </h3>
              <p className="text-secondary-600">
                Get the latest news, updates, and insights delivered to your inbox.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-secondary-600 text-sm">
                © {currentYear} Blueprint. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-6">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-secondary-500 hover:text-secondary-700 transition-colors text-xs"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`p-2 rounded-lg bg-secondary-100 text-secondary-600 transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer