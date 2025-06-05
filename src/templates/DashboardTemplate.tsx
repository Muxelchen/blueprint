import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

// Import your blueprint components
import { Button } from '../components/common';

// Sample data that works with your existing components
const kpiData = [
  { title: 'Total Revenue', value: '$124,563', change: '+12.5%', trend: 'up' as const, icon: DollarSign },
  { title: 'Active Users', value: '8,549', change: '+8.2%', trend: 'up' as const, icon: Users },
  { title: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down' as const, icon: TrendingUp },
  { title: 'Server Uptime', value: '99.9%', change: '+0.1%', trend: 'neutral' as const, icon: Activity }
];

const tableData = [
  { id: 1, customer: 'Acme Corp', amount: '$12,345', status: 'paid', date: '2024-06-01' },
  { id: 2, customer: 'Tech Solutions', amount: '$8,900', status: 'pending', date: '2024-06-02' },
  { id: 3, customer: 'Global Industries', amount: '$15,600', status: 'paid', date: '2024-06-03' }
];

// Simple KPI Card component for the template
const SimpleKPICard: React.FC<{
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<any>;
}> = ({ title, value, change, trend = 'neutral', icon: Icon }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${trendColors[trend]}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

// Simple data table component
const SimpleDataTable: React.FC<{ data: typeof tableData }> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  row.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const DashboardTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900">Your App</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Reports</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">Settings</Button>
            <Button size="sm">Export</Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <a 
                href="#" 
                className="flex items-center space-x-3 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg"
              >
                <BarChart className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SimpleKPICard
                    title={kpi.title}
                    value={kpi.value}
                    change={kpi.change}
                    trend={kpi.trend}
                    icon={kpi.icon}
                  />
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart will be rendered here</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart will be rendered here</p>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Filter</Button>
                  <Button size="sm">Export</Button>
                </div>
              </div>
              <div className="p-6">
                <SimpleDataTable data={tableData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;