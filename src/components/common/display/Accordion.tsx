import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Settings, FileText, Users, Shield } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  variant = 'default',
  size = 'md',
  className = '',
  onItemToggle
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(items.filter(item => item.defaultOpen).map(item => item.id))
  );

  const toggleItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.disabled) return;

    const newOpenItems = new Set(openItems);
    const isCurrentlyOpen = openItems.has(itemId);

    if (allowMultiple) {
      if (isCurrentlyOpen) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
    } else {
      newOpenItems.clear();
      if (!isCurrentlyOpen) {
        newOpenItems.add(itemId);
      }
    }

    setOpenItems(newOpenItems);
    onItemToggle?.(itemId, !isCurrentlyOpen);
  };

  const getAccordionClasses = () => {
    const baseClasses = 'accordion';
    const variantClasses = {
      default: 'space-y-2',
      bordered: 'border border-gray-200 rounded-lg overflow-hidden',
      filled: 'bg-gray-50 rounded-lg overflow-hidden',
      minimal: 'space-y-1'
    };

    return `${baseClasses} ${variantClasses[variant]} ${className}`;
  };

  const getItemClasses = (item: AccordionItem, isOpen: boolean) => {
    const baseClasses = 'accordion-item transition-all duration-200';
    const variantClasses = {
      default: 'border border-gray-200 rounded-lg',
      bordered: 'border-b border-gray-200 last:border-b-0',
      filled: 'border-b border-gray-200 last:border-b-0',
      minimal: ''
    };

    const stateClasses = isOpen ? 'accordion-item-open' : '';
    const disabledClasses = item.disabled ? 'opacity-50' : '';

    return `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${disabledClasses}`;
  };

  const getHeaderClasses = (item: AccordionItem, isOpen: boolean) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    };

    const baseClasses = `
      accordion-header w-full text-left flex items-center justify-between
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
      ${sizeClasses[size]}
    `;

    const variantClasses = {
      default: `bg-white hover:bg-gray-50 ${variant === 'default' ? 'rounded-t-lg' : ''}`,
      bordered: 'bg-white hover:bg-gray-50',
      filled: 'bg-gray-50 hover:bg-gray-100',
      minimal: 'bg-transparent hover:bg-gray-50 rounded-md'
    };

    const stateClasses = isOpen && variant !== 'minimal' ? 'bg-gray-50' : '';
    const disabledClasses = item.disabled ? 'cursor-not-allowed' : 'cursor-pointer';

    return `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${disabledClasses}`;
  };

  const getContentClasses = () => {
    const sizeClasses = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4'
    };

    const variantClasses = {
      default: 'bg-white border-t border-gray-200',
      bordered: 'bg-white border-t border-gray-200',
      filled: 'bg-white border-t border-gray-200',
      minimal: 'bg-transparent'
    };

    return `accordion-content ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  return (
    <div className={getAccordionClasses()}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        
        return (
          <div key={item.id} className={getItemClasses(item, isOpen)}>
            <button
              className={getHeaderClasses(item, isOpen)}
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                )}
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>
              
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className={`${getContentClasses()} animate-accordion-down`}
              >
                <div className="text-gray-700">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Example usage with mock data
export const ExampleAccordion: React.FC = () => {
  const faqItems: AccordionItem[] = [
    {
      id: 'getting-started',
      title: 'How do I get started?',
      icon: <HelpCircle />,
      defaultOpen: true,
      content: (
        <div className="space-y-3">
          <p>Getting started is easy! Follow these simple steps:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Create your account by clicking the "Sign Up" button</li>
            <li>Verify your email address</li>
            <li>Complete your profile setup</li>
            <li>Start exploring the features</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-blue-800 text-sm">💡 Tip: Check out our video tutorials for a quick overview!</p>
          </div>
        </div>
      )
    },
    {
      id: 'account-settings',
      title: 'How can I manage my account settings?',
      icon: <Settings />,
      content: (
        <div className="space-y-3">
          <p>You can manage your account settings in several ways:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Navigate to the Settings page from the main menu</li>
            <li>Update your profile information</li>
            <li>Change your password and security settings</li>
            <li>Manage notification preferences</li>
            <li>Configure privacy settings</li>
          </ul>
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Go to Settings
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'file-management',
      title: 'How do I upload and manage files?',
      icon: <FileText />,
      content: (
        <div className="space-y-3">
          <p>File management is straightforward:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 border rounded-md">
              <h4 className="font-semibold mb-2">Uploading Files</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Drag and drop files</li>
                <li>Use the upload button</li>
                <li>Bulk upload support</li>
              </ul>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-semibold mb-2">File Organization</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Create folders</li>
                <li>Tag your files</li>
                <li>Search and filter</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'team-collaboration',
      title: 'How does team collaboration work?',
      icon: <Users />,
      content: (
        <div className="space-y-3">
          <p>Collaborate effectively with your team:</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Invite Team Members</h4>
                <p className="text-sm text-gray-600">Send invitations via email or shared links</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Assign Roles</h4>
                <p className="text-sm text-gray-600">Set permissions and access levels</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Real-time Collaboration</h4>
                <p className="text-sm text-gray-600">Work together in real-time with live updates</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'What security measures are in place?',
      icon: <Shield />,
      disabled: true,
      content: (
        <div>
          <p>This section is currently being updated with the latest security information.</p>
        </div>
      )
    }
  ];

  const settingsItems: AccordionItem[] = [
    {
      id: 'general',
      title: 'General Settings',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email notifications</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Push notifications</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">SMS notifications</span>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">FAQ (Default Style)</h3>
        <Accordion
          items={faqItems}
          allowMultiple={true}
          onItemToggle={(itemId, isOpen) => console.log(`FAQ ${itemId} ${isOpen ? 'opened' : 'closed'}`)}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Settings (Bordered Style)</h3>
        <Accordion
          items={settingsItems}
          variant="bordered"
          size="lg"
          allowMultiple={false}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Minimal Style</h3>
        <Accordion
          items={faqItems.slice(0, 3)}
          variant="minimal"
          size="sm"
          allowMultiple={true}
        />
      </div>
    </div>
  );
};

export default Accordion;