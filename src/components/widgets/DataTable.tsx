import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface TableData {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  salary: number;
  performance: number;
}

const mockData: TableData[] = [
  { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', status: 'Active', joinDate: '2023-01-15', salary: 85000, performance: 92 },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', status: 'Active', joinDate: '2023-03-22', salary: 72000, performance: 88 },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', status: 'Pending', joinDate: '2023-06-10', salary: 68000, performance: 85 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', department: 'Engineering', status: 'Active', joinDate: '2022-11-08', salary: 92000, performance: 95 },
  { id: 5, name: 'David Brown', email: 'david@company.com', department: 'Marketing', status: 'Inactive', joinDate: '2023-02-18', salary: 65000, performance: 78 },
  { id: 6, name: 'Lisa Davis', email: 'lisa@company.com', department: 'HR', status: 'Active', joinDate: '2023-04-05', salary: 58000, performance: 91 },
  { id: 7, name: 'Tom Anderson', email: 'tom@company.com', department: 'Sales', status: 'Active', joinDate: '2023-01-30', salary: 75000, performance: 89 },
  { id: 8, name: 'Emily Garcia', email: 'emily@company.com', department: 'Engineering', status: 'Active', joinDate: '2022-09-12', salary: 88000, performance: 94 },
  { id: 9, name: 'Chris Martinez', email: 'chris@company.com', department: 'Marketing', status: 'Pending', joinDate: '2023-07-01', salary: 70000, performance: 82 },
  { id: 10, name: 'Amanda Taylor', email: 'amanda@company.com', department: 'HR', status: 'Active', joinDate: '2023-05-20', salary: 62000, performance: 87 },
  { id: 11, name: 'Ryan Clark', email: 'ryan@company.com', department: 'Sales', status: 'Active', joinDate: '2023-03-15', salary: 73000, performance: 90 },
  { id: 12, name: 'Michelle White', email: 'michelle@company.com', department: 'Engineering', status: 'Inactive', joinDate: '2022-12-01', salary: 90000, performance: 86 },
];

interface DataTableProps {
  data?: TableData[];
  title?: string;
  pageSize?: number;
}

type SortField = keyof TableData;
type SortDirection = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ 
  data = mockData, 
  title = 'Employee Database',
  pageSize = 5
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const departments = Array.from(new Set(data.map(item => item.department)));
  const statuses = Array.from(new Set(data.map(item => item.status)));

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesDepartment = filterDepartment === 'all' || item.department === filterDepartment;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection, filterStatus, filterDepartment]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm text-gray-500">
          {filteredAndSortedData.length} of {data.length} records
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('department')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Department {getSortIcon('department')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('joinDate')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Join Date {getSortIcon('joinDate')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('salary')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Salary {getSortIcon('salary')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('performance')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Performance {getSortIcon('performance')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">ID: {item.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.joinDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900 mr-2">{item.performance}%</div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.performance >= 90 ? 'bg-green-500' :
                          item.performance >= 80 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${item.performance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Summary Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg">{filteredAndSortedData.filter(d => d.status === 'Active').length}</p>
            <p className="text-gray-600">Active</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">
              {formatCurrency(filteredAndSortedData.reduce((sum, d) => sum + d.salary, 0) / filteredAndSortedData.length)}
            </p>
            <p className="text-gray-600">Avg Salary</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">
              {Math.round(filteredAndSortedData.reduce((sum, d) => sum + d.performance, 0) / filteredAndSortedData.length)}%
            </p>
            <p className="text-gray-600">Avg Performance</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{departments.length}</p>
            <p className="text-gray-600">Departments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;