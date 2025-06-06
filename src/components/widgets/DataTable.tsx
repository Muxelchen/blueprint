import React, { useState, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';

// Type definitions
interface TableData {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  salary: number;
  performance: number;
  joinDate: string;
}

type SortField = keyof TableData;
type SortDirection = 'asc' | 'desc';

// Mock data
const mockData: TableData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', status: 'Active', salary: 85000, performance: 92, joinDate: '2022-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', status: 'Active', salary: 72000, performance: 88, joinDate: '2021-11-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', status: 'Inactive', salary: 68000, performance: 75, joinDate: '2020-08-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'Engineering', status: 'Active', salary: 95000, performance: 95, joinDate: '2023-03-01' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', department: 'HR', status: 'Pending', salary: 65000, performance: 82, joinDate: '2024-01-10' },
  { id: 6, name: 'Diana Lee', email: 'diana@example.com', department: 'Marketing', status: 'Active', salary: 78000, performance: 89, joinDate: '2022-07-05' },
  { id: 7, name: 'Edward Davis', email: 'edward@example.com', department: 'Sales', status: 'Active', salary: 71000, performance: 84, joinDate: '2021-05-15' },
  { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', department: 'Engineering', status: 'Active', salary: 89000, performance: 91, joinDate: '2022-12-01' },
];

interface SortButtonProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}

const SortButton: React.FC<SortButtonProps> = ({ field, currentField, direction, onSort, children }) => (
  <button 
    className="flex items-center space-x-1 hover:text-blue-600 transition-colors font-medium"
    onClick={() => onSort(field)}
  >
    <span>{children}</span>
    {currentField === field && (
      direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
    )}
  </button>
);

const AvatarCell = ({ item }: { item: TableData }) => (
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
      {item.name.split(' ').map((n: string) => n[0]).join('')}
    </div>
    <div>
      <div className="font-medium text-gray-900">{item.name}</div>
      <div className="text-sm text-gray-500">{item.email}</div>
    </div>
  </div>
);

interface DataTableProps {
  data?: TableData[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
  size?: 'small' | 'medium' | 'large' | 'auto';
  height?: number;
  compact?: boolean;
  showStats?: boolean;
  maxRows?: number; // Limit visible rows for compact layouts
}

const DataTable: React.FC<DataTableProps> = ({
  data = mockData,
  title = 'Employee Data',
  searchable = true,
  filterable = true,
  exportable = true,
  pageSize = 5,
  size = 'medium',
  height,
  compact: compactProp,
  showStats = true,
  maxRows,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [compactMode, setCompactMode] = useState(compactProp);

  // Calculate adaptive dimensions based on content complexity
  const getAdaptiveDimensions = () => {
    const dataVolume = data.length;
    const visibleColumns = compactMode ? 5 : 6; // Fewer columns in compact mode
    const effectivePageSize = maxRows ? Math.min(pageSize, maxRows) : pageSize;
    
    let rowHeight: number;
    let containerMinHeight: number;
    let tableMaxHeight: number;
    
    if (height) {
      // Use provided height if specified
      containerMinHeight = height;
      tableMaxHeight = height - 200; // Account for headers and controls
      rowHeight = compactMode ? 32 : 48;
    } else if (size === 'small' || compactMode) {
      rowHeight = 32; // Compact row height
      tableMaxHeight = Math.max(200, effectivePageSize * rowHeight + 50);
      containerMinHeight = tableMaxHeight + 180;
    } else if (size === 'large') {
      rowHeight = Math.max(56, 56 + Math.floor(dataVolume / 100)); // Scale with data volume
      tableMaxHeight = Math.max(400, effectivePageSize * rowHeight + 60);
      containerMinHeight = tableMaxHeight + 250;
    } else if (size === 'medium') {
      rowHeight = 48;
      tableMaxHeight = Math.max(300, effectivePageSize * rowHeight + 50);
      containerMinHeight = tableMaxHeight + 200;
    } else {
      // Auto sizing based on data complexity
      const baseRowHeight = 44;
      const volumeBonus = Math.min(Math.floor(dataVolume / 50), 8); // Max 8px bonus
      const columnComplexity = visibleColumns * 2; // Account for column count
      
      rowHeight = baseRowHeight + volumeBonus + columnComplexity;
      tableMaxHeight = Math.max(250, effectivePageSize * rowHeight + 60);
      containerMinHeight = tableMaxHeight + (showStats ? 220 : 180);
    }
    
    return {
      rowHeight: Math.max(rowHeight, compactMode ? 28 : 40),
      containerMinHeight: Math.max(containerMinHeight, compactMode ? 300 : 400),
      tableMaxHeight: Math.max(tableMaxHeight, 200),
      columnMinWidths: compactMode ? {
        name: '120px',
        department: '60px',
        status: '50px',
        salary: '60px',
        performance: '80px'
      } : {
        name: '160px',
        department: '100px',
        status: '80px',
        salary: '90px',
        performance: '120px'
      }
    };
  };

  const dimensions = getAdaptiveDimensions();

  // Filter options
  const departments = useMemo(() => 
    Array.from(new Set(data.map((item: TableData) => item.department))),
    [data]
  );
  
  const statuses = useMemo(() => 
    Array.from(new Set(data.map((item: TableData) => item.status))),
    [data]
  );

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item: TableData) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesDepartment = !departmentFilter || item.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });

    filtered.sort((a: TableData, b: TableData) => {
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
  }, [data, searchTerm, statusFilter, departmentFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Event handlers
  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev: SortDirection) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((item: TableData) => item.id)));
    }
  }, [selectedRows.size, paginatedData]);

  const handleRowSelect = useCallback((id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  }, [selectedRows]);

  const exportToCSV = useCallback(() => {
    const headers = ['Name', 'Email', 'Department', 'Status', 'Salary', 'Performance', 'Join Date'];
    const csvData = [
      headers,
      ...filteredAndSortedData.map((item: TableData) => [
        item.name, item.email, item.department, item.status, 
        item.salary.toString(), item.performance.toString(), item.joinDate
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredAndSortedData]);

  // Statistics
  const statistics = useMemo(() => ({
    total: filteredAndSortedData.length,
    active: filteredAndSortedData.filter((d: TableData) => d.status === 'Active').length,
    avgSalary: filteredAndSortedData.reduce((sum: number, d: TableData) => sum + d.salary, 0) / filteredAndSortedData.length || 0,
    avgPerformance: Math.round(filteredAndSortedData.reduce((sum: number, d: TableData) => sum + d.performance, 0) / filteredAndSortedData.length) || 0,
  }), [filteredAndSortedData]);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden"
      style={{ 
        minHeight: `${dimensions.containerMinHeight}px`,
        height: size === 'large' ? `${dimensions.containerMinHeight}px` : 'auto'
      }}
    >
      {/* Header - More compact */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-800 truncate">{title}</h3>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setCompactMode(!compactMode)}
            className={`p-1.5 text-xs rounded transition-colors ${compactMode ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            title="Toggle compact mode"
          >
            Compact
          </button>
          {exportable && (
            <button 
              onClick={exportToCSV}
              className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics - Conditional display based on space */}
      {!compactMode && showStats && (
        <div className="grid grid-cols-4 gap-2 p-3 border-b border-gray-200 flex-shrink-0">
          <div className="bg-blue-50 p-2 rounded text-center">
            <p className="text-xs text-blue-600 font-medium">Total</p>
            <p className="text-lg font-bold text-blue-800">{statistics.total}</p>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <p className="text-xs text-green-600 font-medium">Active</p>
            <p className="text-lg font-bold text-green-800">{statistics.active}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <p className="text-xs text-purple-600 font-medium">Avg $</p>
            <p className="text-lg font-bold text-purple-800">{Math.round(statistics.avgSalary / 1000)}k</p>
          </div>
          <div className="bg-orange-50 p-2 rounded text-center">
            <p className="text-xs text-orange-600 font-medium">Perf</p>
            <p className="text-lg font-bold text-orange-800">{statistics.avgPerformance}%</p>
          </div>
        </div>
      )}

      {/* Controls - More compact layout */}
      <div className="flex flex-col gap-2 p-3 border-b border-gray-200 flex-shrink-0">
        {/* Search */}
        {searchable && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Filters - Horizontal layout for space efficiency */}
        {filterable && (
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status as string} value={status as string}>{status as string}</option>
              ))}
            </select>
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Depts</option>
              {departments.map((dept) => (
                <option key={dept as string} value={dept as string}>{dept as string}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table - Enhanced responsive design with adaptive sizing */}
      <div 
        className="flex-1 overflow-auto min-h-0" 
        style={{ 
          maxHeight: `${dimensions.tableMaxHeight}px`
        }}
      >
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b border-gray-200" style={{ height: `${Math.max(dimensions.rowHeight * 0.8, 32)}px` }}>
              <th className="text-left py-2 px-2 w-8">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="text-left py-2 px-2" style={{ minWidth: dimensions.columnMinWidths.name }}>
                <SortButton field="name" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                  Employee
                </SortButton>
              </th>
              <th className="text-left py-2 px-2" style={{ minWidth: dimensions.columnMinWidths.department }}>
                <SortButton field="department" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                  {compactMode ? 'Dept' : 'Department'}
                </SortButton>
              </th>
              <th className="text-left py-2 px-2" style={{ minWidth: dimensions.columnMinWidths.status }}>
                <SortButton field="status" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                  Status
                </SortButton>
              </th>
              <th className="text-left py-2 px-2" style={{ minWidth: dimensions.columnMinWidths.salary }}>
                <SortButton field="salary" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                  Salary
                </SortButton>
              </th>
              {!compactMode && (
                <th className="text-left py-2 px-2" style={{ minWidth: dimensions.columnMinWidths.performance }}>
                  <SortButton field="performance" currentField={sortField} direction={sortDirection} onSort={handleSort}>
                    Performance
                  </SortButton>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item: TableData, index: number) => (
              <tr 
                key={item.id} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                style={{ height: `${dimensions.rowHeight}px` }}
              >
                <td className="py-2 px-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="py-2 px-2">
                  {compactMode ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate">{item.email}</div>
                    </div>
                  ) : (
                    <AvatarCell item={item} />
                  )}
                </td>
                <td className="py-2 px-2 text-sm text-gray-900 truncate">{item.department}</td>
                <td className="py-2 px-2">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Active' ? 'bg-green-100 text-green-800' :
                    item.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {compactMode ? item.status.charAt(0) : item.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-sm text-gray-900">
                  ${compactMode ? `${Math.round(item.salary / 1000)}k` : item.salary.toLocaleString()}
                </td>
                {!compactMode && (
                  <td className="py-2 px-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${item.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">{item.performance}%</span>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Compact version */}
      <div className="flex items-center justify-between p-3 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-700">
          {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else {
                if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 text-xs rounded ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Selected items info - Compact */}
      {selectedRows.size > 0 && (
        <div className="p-2 bg-blue-50 border-t border-blue-200 flex-shrink-0">
          <p className="text-xs text-blue-800">
            {selectedRows.size} selected
            <button 
              onClick={() => setSelectedRows(new Set())}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTable;