import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Filter, Download, Calendar } from 'lucide-react';
import { Button } from '../components/common';

// Analytics-focused template with advanced charts and filters
export const AnalyticsTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900">Analytics Dashboard</div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" leftIcon={<Filter />}>Filters</Button>
            <Button variant="outline" size="sm" leftIcon={<Calendar />}>Date Range</Button>
            <Button size="sm" leftIcon={<Download />}>Export Report</Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Visitors" value="125,834" change="+12.5%" trend="up" />
          <MetricCard title="Page Views" value="384,292" change="+8.3%" trend="up" />
          <MetricCard title="Bounce Rate" value="42.3%" change="-5.2%" trend="down" />
          <MetricCard title="Avg. Session" value="3m 24s" change="+15.6%" trend="up" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer title="Traffic Overview" icon={<BarChart3 />}>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Advanced Line Chart Here</p>
            </div>
          </ChartContainer>

          <ChartContainer title="Traffic Sources" icon={<PieChart />}>
            <div className="h-80 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Donut Chart Here</p>
            </div>
          </ChartContainer>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ChartContainer title="Real-time Analytics" icon={<TrendingUp />}>
              <div className="h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Real-time Chart Here</p>
              </div>
            </ChartContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
              <div className="space-y-3">
                {['/dashboard', '/analytics', '/reports', '/settings'].map((page, i) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{page}</span>
                    <span className="text-sm font-medium">{Math.floor(Math.random() * 5000)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Goals</h3>
              <div className="space-y-4">
                <GoalProgress label="Monthly Visitors" current={84} target={100} />
                <GoalProgress label="Conversion Rate" current={67} target={100} />
                <GoalProgress label="Revenue Goal" current={92} target={100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}> = ({ title, value, change, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
  >
    <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
      {change}
    </p>
  </motion.div>
);

const ChartContainer: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <Button variant="ghost" size="sm">⋯</Button>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const GoalProgress: React.FC<{
  label: string;
  current: number;
  target: number;
}> = ({ label, current, target }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900">{current}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${current}%` }}
      />
    </div>
  </div>
);

export default AnalyticsTemplate;