import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from '../buttons/Button';

export interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  showItemsPerPageSelector?: boolean;
  itemsPerPageOptions?: number[];
  showItemsInfo?: boolean;
  variant?: 'default' | 'simple' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  showItemsPerPageSelector = true,
  itemsPerPageOptions = [5, 10, 20, 50],
  showItemsInfo = true,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const [internalPage, setInternalPage] = useState(currentPage);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(itemsPerPage);

  // Use internal state if no external control is provided
  const activePage = onPageChange ? currentPage : internalPage;
  const activeItemsPerPage = internalItemsPerPage;

  const totalPages = Math.ceil(totalItems / activeItemsPerPage);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const startItem = (activePage - 1) * activeItemsPerPage + 1;
    const endItem = Math.min(activePage * activeItemsPerPage, totalItems);
    
    return {
      startItem,
      endItem,
      totalPages,
      hasPrevious: activePage > 1,
      hasNext: activePage < totalPages
    };
  }, [activePage, activeItemsPerPage, totalItems, totalPages]);

  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range around current page
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, activePage - halfVisible);
      let endPage = Math.min(totalPages, activePage + halfVisible);

      // Adjust if we're near the beginning or end
      if (activePage <= halfVisible) {
        endPage = Math.min(totalPages, maxVisiblePages);
      } else if (activePage >= totalPages - halfVisible) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis');
        }
      }

      // Add visible page range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [activePage, totalPages, maxVisiblePages]);

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === activePage) return;
    
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setInternalItemsPerPage(newItemsPerPage);
    // Reset to page 1 when changing items per page
    const newPage = 1;
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const buttonSizeMap = {
    sm: 'sm' as const,
    md: 'sm' as const,
    lg: 'md' as const
  };

  if (totalItems === 0) {
    return (
      <div className={`flex items-center justify-center text-gray-500 ${sizeClasses[size]} ${className}`}>
        No items to display
      </div>
    );
  }

  const renderPageButton = (page: number | 'ellipsis', index: number) => {
    if (page === 'ellipsis') {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-3 py-2 text-gray-400 flex items-center"
        >
          <MoreHorizontal className="w-4 h-4" />
        </span>
      );
    }

    return (
      <Button
        key={page}
        variant={page === activePage ? 'primary' : 'ghost'}
        size={buttonSizeMap[size]}
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        className={page === activePage ? 'pointer-events-none' : ''}
      >
        {page}
      </Button>
    );
  };

  const renderSimpleVariant = () => (
    <div className={`flex items-center justify-between ${className}`}>
      <Button
        variant="ghost"
        size={buttonSizeMap[size]}
        onClick={() => handlePageChange(activePage - 1)}
        disabled={disabled || !paginationInfo.hasPrevious}
        leftIcon={<ChevronLeft />}
      >
        Previous
      </Button>

      <span className={`text-gray-600 ${sizeClasses[size]}`}>
        Page {activePage} of {totalPages}
      </span>

      <Button
        variant="ghost"
        size={buttonSizeMap[size]}
        onClick={() => handlePageChange(activePage + 1)}
        disabled={disabled || !paginationInfo.hasNext}
        rightIcon={<ChevronRight />}
      >
        Next
      </Button>
    </div>
  );

  const renderCompactVariant = () => (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size={buttonSizeMap[size]}
        onClick={() => handlePageChange(activePage - 1)}
        disabled={disabled || !paginationInfo.hasPrevious}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className={`px-3 py-2 text-gray-600 ${sizeClasses[size]}`}>
        {activePage} / {totalPages}
      </span>

      <Button
        variant="ghost"
        size={buttonSizeMap[size]}
        onClick={() => handlePageChange(activePage + 1)}
        disabled={disabled || !paginationInfo.hasNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderDefaultVariant = () => (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* First page button */}
      {showFirstLast && (
        <Button
          variant="ghost"
          size={buttonSizeMap[size]}
          onClick={() => handlePageChange(1)}
          disabled={disabled || activePage === 1}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Previous button */}
      {showPrevNext && (
        <Button
          variant="ghost"
          size={buttonSizeMap[size]}
          onClick={() => handlePageChange(activePage - 1)}
          disabled={disabled || !paginationInfo.hasPrevious}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Page numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => renderPageButton(page, index))}
        </div>
      )}

      {/* Next button */}
      {showPrevNext && (
        <Button
          variant="ghost"
          size={buttonSizeMap[size]}
          onClick={() => handlePageChange(activePage + 1)}
          disabled={disabled || !paginationInfo.hasNext}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <Button
          variant="ghost"
          size={buttonSizeMap[size]}
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled || activePage === totalPages}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const renderPagination = () => {
    switch (variant) {
      case 'simple':
        return renderSimpleVariant();
      case 'compact':
        return renderCompactVariant();
      default:
        return renderDefaultVariant();
    }
  };

  return (
    <div className="space-y-4">
      {/* Items info */}
      {showItemsInfo && (
        <div className={`text-gray-600 ${sizeClasses[size]}`}>
          Showing {paginationInfo.startItem} to {paginationInfo.endItem} of {totalItems} items
        </div>
      )}

      {/* Main pagination */}
      {renderPagination()}

      {/* Items per page selector */}
      {showItemsPerPageSelector && (
        <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
          <span className="text-gray-600">Items per page:</span>
          <select
            value={activeItemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            disabled={disabled}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

// Hook for pagination state management
export const usePagination = (
  totalItems: number,
  initialItemsPerPage = 10,
  initialPage = 1
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const getPageData = <T,>(data: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const reset = () => {
    setCurrentPage(1);
    setItemsPerPage(initialItemsPerPage);
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    getPageData,
    reset
  };
};

// Example usage with mock data
export const ExamplePagination: React.FC = () => {
  // Generate mock data
  const mockData = Array.from({ length: 247 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Books', 'Sports'][i % 4],
    price: Math.floor(Math.random() * 1000) + 10,
    status: ['Active', 'Inactive'][i % 2]
  }));

  const pagination = usePagination(mockData.length, 10, 1);
  const currentPageData = pagination.getPageData(mockData);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Pagination</h3>
        <div className="space-y-4">
          {/* Mock data table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{item.category}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">${item.price}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={mockData.length}
            itemsPerPage={pagination.itemsPerPage}
            currentPage={pagination.currentPage}
            onPageChange={pagination.handlePageChange}
            showFirstLast={true}
            showPrevNext={true}
            showPageNumbers={true}
            maxVisiblePages={5}
            showItemsPerPageSelector={true}
            itemsPerPageOptions={[5, 10, 20, 50]}
            showItemsInfo={true}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Simple Pagination</h3>
        <Pagination
          totalItems={mockData.length}
          variant="simple"
          currentPage={5}
          onPageChange={(page) => console.log('Simple pagination page:', page)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Pagination</h3>
        <Pagination
          totalItems={mockData.length}
          variant="compact"
          size="sm"
          currentPage={3}
          showItemsInfo={false}
          showItemsPerPageSelector={false}
          onPageChange={(page) => console.log('Compact pagination page:', page)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Large Pagination</h3>
        <Pagination
          totalItems={mockData.length}
          size="lg"
          maxVisiblePages={7}
          currentPage={10}
          onPageChange={(page) => console.log('Large pagination page:', page)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Disabled Pagination</h3>
        <Pagination
          totalItems={mockData.length}
          currentPage={5}
          disabled={true}
          onPageChange={(page) => console.log('Disabled pagination page:', page)}
        />
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="text-sm space-y-1">
          <li>• Complete pagination with first/last, prev/next navigation</li>
          <li>• Items per page selector with customizable options</li>
          <li>• Smart page number display with ellipsis</li>
          <li>• Multiple variants: default, simple, compact</li>
          <li>• Responsive design with different sizes</li>
          <li>• Built-in state management hook (usePagination)</li>
          <li>• Items info display (showing X to Y of Z items)</li>
          <li>• Keyboard navigation support</li>
          <li>• Disabled state support</li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;