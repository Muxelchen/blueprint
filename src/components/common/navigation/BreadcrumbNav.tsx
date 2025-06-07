import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
  className?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHome = true,
  maxItems = 5,
  className = '',
}) => {
  // Truncate items if they exceed maxItems
  const displayItems = items.length > maxItems 
    ? [
        ...items.slice(0, 1), // First item
        { id: 'ellipsis', label: '...', onClick: () => {} }, // Ellipsis
        ...items.slice(-(maxItems - 2)) // Last items
      ]
    : items;

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const itemClass = `
      flex items-center gap-1 px-2 py-1 rounded transition-colors duration-200
      ${isLast 
        ? 'text-gray-900 dark:text-white font-medium cursor-default' 
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
      }
      ${item.id === 'ellipsis' ? 'cursor-default' : ''}
    `;

    const content = (
      <>
        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
        <span className="text-sm">{item.label}</span>
      </>
    );

    if (item.id === 'ellipsis') {
      return (
        <span key={item.id} className={itemClass}>
          {content}
        </span>
      );
    }

    if (item.href && !isLast) {
      return (
        <a key={item.id} href={item.href} className={itemClass}>
          {content}
        </a>
      );
    }

    if (item.onClick && !isLast) {
      return (
        <button key={item.id} onClick={item.onClick} className={itemClass}>
          {content}
        </button>
      );
    }

    return (
      <span key={item.id} className={itemClass}>
        {content}
      </span>
    );
  };

  return (
    <nav 
      className={`flex items-center gap-1 ${className}`}
      aria-label="Breadcrumb"
    >
      {showHome && (
        <>
          <button 
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => window.location.href = '/'}
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          {displayItems.length > 0 && (
            <span className="text-gray-400 dark:text-gray-600 flex items-center">
              {separator}
            </span>
          )}
        </>
      )}
      
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        
        return (
          <React.Fragment key={item.id}>
            {renderBreadcrumbItem(item, index, isLast)}
            {!isLast && (
              <span className="text-gray-400 dark:text-gray-600 flex items-center">
                {separator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNav; 