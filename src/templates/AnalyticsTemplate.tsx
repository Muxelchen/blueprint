import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Filter, Download, Calendar } from 'lucide-react';
import { Button } from '../components/common';
import { LineChart, PieChart as PieChartWidget, DonutChart } from '../components/widgets';

// Analytics-focused template with advanced charts and filters
export const AnalyticsTemplate: React.FC = () => {
  // Sample data for charts - corrected to match LineData interface
  const lineChartData = [
    { name: 'Jan', sales: 4000, revenue: 2400, profit: 1600, visitors: 12000 },
    { name: 'Feb', sales: 3000, revenue: 1398, profit: 932, visitors: 9800 },
    { name: 'Mar', sales: 2000, revenue: 9800, profit: 7840, visitors: 15600 },
    { name: 'Apr', sales: 2780, revenue: 3908, profit: 2635, visitors: 11200 },
    { name: 'May', sales: 1890, revenue: 4800, profit: 3840, visitors: 13400 },
    { name: 'Jun', sales: 2390, revenue: 3800, profit: 3040, visitors: 10800 },
  ];

  const pieChartData = [
    { name: 'Organic Search', value: 45, color: '#3B82F6' },
    { name: 'Direct Traffic', value: 30, color: '#10B981' },
    { name: 'Social Media', value: 15, color: '#F59E0B' },
    { name: 'Email Campaign', value: 10, color: '#EF4444' },
  ];

  const donutChartData = [
    { name: 'Desktop', value: 55, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 10, color: '#F59E0B' },
  ];

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
            <div className="h-80">
              <LineChart 
                data={lineChartData}
                title="Visitor Trends"
                height={320}
                compact={false}
              />
            </div>
          </ChartContainer>

          <ChartContainer title="Traffic Sources" icon={<PieChart />}>
            <div className="h-80">
              <PieChartWidget 
                data={pieChartData}
                title="Traffic Sources"
                height={320}
                showLegend={true}
              />
            </div>
          </ChartContainer>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ChartContainer title="Real-time Analytics" icon={<TrendingUp />}>
              <div className="h-96">
                <LineChart 
                  data={lineChartData}
                  title="Real-time Traffic"
                  height={384}
                  compact={false}
                />
              </div>
            </ChartContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
              <div className="h-64">
                <DonutChart 
                  data={donutChartData}
                  title="Device Distribution"
                  centerText="Total Devices"
                  size="small"
                  compact={true}
                />
              </div>
            </div>

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