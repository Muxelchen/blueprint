import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Search, Plus, Edit, Trash2, Filter, Download, Eye } from 'lucide-react';
import { Button } from '../components/common';

// Data management template with advanced tables, forms, and CRUD operations
export const DataTableTemplate: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const sampleData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      joined: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
      joined: '2024-02-20',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Editor',
      status: 'Inactive',
      joined: '2024-03-10',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'User',
      status: 'Active',
      joined: '2024-03-25',
    },
  ];

  const filteredData = sampleData.filter(
    item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">Manage users, roles, and permissions</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" leftIcon={<Filter />}>
              Filter
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Download />}>
              Export
            </Button>
            <Button size="sm" leftIcon={<Plus />}>
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Users" value="1,234" icon="👥" />
          <StatsCard title="Active Users" value="1,180" icon="✅" />
          <StatsCard title="New This Month" value="48" icon="📈" />
          <StatsCard title="Pending Approval" value="12" icon="⏳" />
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {selectedRows.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedRows.length} selected</span>
                  <Button variant="outline" size="sm">
                    Bulk Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'Editor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to {filteredData.length} of {sampleData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ActionCard icon="📝" title="Create User" description="Add new user" />
                <ActionCard icon="👥" title="Bulk Import" description="Import from CSV" />
                <ActionCard icon="📊" title="Generate Report" description="User analytics" />
                <ActionCard icon="⚙️" title="Settings" description="User preferences" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <ActivityItem user="John Doe" action="logged in" time="2 minutes ago" />
                <ActivityItem user="Jane Smith" action="updated profile" time="15 minutes ago" />
                <ActivityItem user="Bob Johnson" action="changed password" time="1 hour ago" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ title: string; value: string; icon: string }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

const ActionCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
    <div className="text-2xl mb-2">{icon}</div>
    <h4 className="font-medium text-gray-900">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const ActivityItem: React.FC<{ user: string; action: string; time: string }> = ({
  user,
  action,
  time,
}) => (
  <div className="flex items-center space-x-3">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="flex-1">
      <p className="text-sm">
        <span className="font-medium">{user}</span> {action}
      </p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

export default DataTableTemplate;
