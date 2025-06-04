import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, Settings, LogOut, Menu, FileText, BarChart3 } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  disabled?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  position = 'bottom-left',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenSubmenus(new Set());
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setOpenSubmenus(new Set());
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleSubmenu = (itemId: string) => {
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(itemId)) {
      newOpenSubmenus.delete(itemId);
    } else {
      newOpenSubmenus.add(itemId);
    }
    setOpenSubmenus(newOpenSubmenus);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    if (item.children) {
      toggleSubmenu(item.id);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      if (item.href) {
        window.location.href = item.href;
      }
      setIsOpen(false);
      setOpenSubmenus(new Set());
    }
  };

  const positionClasses = {
    'bottom-left': 'top-full left-0',
    'bottom-right': 'top-full right-0',
    'top-left': 'bottom-full left-0',
    'top-right': 'bottom-full right-0'
  };

  const renderMenuItem = (item: DropdownItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenus.has(item.id);

    return (
      <div key={item.id} className="relative">
        {item.divider && <div className="border-t border-gray-200 my-1" />}
        
        <button
          className={`
            w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150
            flex items-center justify-between group
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${level > 0 ? 'pl-8' : ''}
          `}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          <div className="flex items-center gap-2">
            {item.icon && (
              <span className="w-4 h-4 text-gray-500">{item.icon}</span>
            )}
            <span className="text-gray-700">{item.label}</span>
          </div>
          
          {hasChildren && (
            <ChevronRight 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isSubmenuOpen ? 'rotate-90' : ''
              }`}
            />
          )}
        </button>

        {hasChildren && isSubmenuOpen && (
          <div className="bg-gray-50 border-l-2 border-gray-200 ml-4">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        className={`
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
          transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-1 min-w-56 bg-white rounded-md shadow-lg border border-gray-200
            transform transition-all duration-200 ease-out
            ${positionClasses[position]}
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          <div className="py-1">
            {items.map(item => renderMenuItem(item))}
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage with mock data
export const ExampleDropdownMenu: React.FC = () => {
  const mockItems: DropdownItem[] = [
    {
      id: '1',
      label: 'Profile',
      icon: <User />,
      onClick: () => console.log('Profile clicked')
    },
    {
      id: '2',
      label: 'Dashboard',
      icon: <BarChart3 />,
      children: [
        {
          id: '2-1',
          label: 'Analytics',
          icon: <BarChart3 />,
          onClick: () => console.log('Analytics clicked')
        },
        {
          id: '2-2',
          label: 'Reports',
          icon: <FileText />,
          onClick: () => console.log('Reports clicked')
        }
      ]
    },
    {
      id: '3',
      label: 'Settings',
      icon: <Settings />,
      children: [
        {
          id: '3-1',
          label: 'General',
          onClick: () => console.log('General settings clicked')
        },
        {
          id: '3-2',
          label: 'Security',
          onClick: () => console.log('Security settings clicked')
        },
        {
          id: '3-3',
          label: 'Advanced',
          children: [
            {
              id: '3-3-1',
              label: 'API Keys',
              onClick: () => console.log('API Keys clicked')
            },
            {
              id: '3-3-2',
              label: 'Webhooks',
              onClick: () => console.log('Webhooks clicked')
            }
          ]
        }
      ]
    },
    {
      id: 'divider',
      label: '',
      divider: true
    },
    {
      id: '4',
      label: 'Logout',
      icon: <LogOut />,
      onClick: () => console.log('Logout clicked')
    }
  ];

  return (
    <DropdownMenu
      trigger={
        <>
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </>
      }
      items={mockItems}
      position="bottom-left"
    />
  );
};

export default DropdownMenu;