import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import Button from '../buttons/Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstElementRef = useRef<HTMLElement | null>(null);
  const lastElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus management
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        firstElementRef.current = focusableElements[0] as HTMLElement;
        lastElementRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;
        firstElementRef.current?.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }

        // Tab trap
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstElementRef.current) {
              event.preventDefault();
              lastElementRef.current?.focus();
            }
          } else {
            if (document.activeElement === lastElementRef.current) {
              event.preventDefault();
              firstElementRef.current?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, closeOnEscape, onClose]);

  const getSizeClasses = () => {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4',
    };
    return sizeClasses[size];
  };

  const getVariantIcon = () => {
    const icons = {
      default: null,
      success: <CheckCircle className="w-6 h-6 text-green-600" />,
      warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      danger: <AlertCircle className="w-6 h-6 text-red-600" />,
      info: <Info className="w-6 h-6 text-blue-600" />,
    };
    return icons[variant];
  };

  const getVariantClasses = () => {
    const variantClasses = {
      default: 'border-gray-200',
      success: 'border-green-200 bg-green-50',
      warning: 'border-yellow-200 bg-yellow-50',
      danger: 'border-red-200 bg-red-50',
      info: 'border-blue-200 bg-blue-50',
    };
    return variantClasses[variant];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`
            relative transform transition-all bg-white rounded-lg shadow-xl border
            ${getSizeClasses()} ${getVariantClasses()} ${className}
            animate-modal-in
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div
              className={`flex items-center justify-between p-6 border-b ${getVariantClasses()}`}
            >
              <div className="flex items-center gap-3">
                {getVariantIcon()}
                {title && (
                  <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
              </div>

              {showCloseButton && (
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook for modal state management
export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

// Example usage with different modal types
export const ExampleModals: React.FC = () => {
  const basicModal = useModal();
  const confirmModal = useModal();
  const formModal = useModal();
  const successModal = useModal();
  const warningModal = useModal();

  const handleConfirmAction = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Action confirmed!');
    }
    confirmModal.closeModal();
    successModal.openModal();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (process.env.NODE_ENV === 'development') {
      console.log('Form submitted!');
    }
    formModal.closeModal();
    successModal.openModal();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={basicModal.openModal}>Basic Modal</Button>

        <Button onClick={confirmModal.openModal} variant="danger">
          Confirm Modal
        </Button>

        <Button onClick={formModal.openModal} variant="primary">
          Form Modal
        </Button>

        <Button onClick={warningModal.openModal} variant="warning">
          Warning Modal
        </Button>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={basicModal.isOpen}
        onClose={basicModal.closeModal}
        title="Basic Modal"
        size="md"
      >
        <div className="space-y-4">
          <p>This is a basic modal with some content. You can put any React components here.</p>
          <div className="p-4 bg-gray-100 rounded-md">
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Keyboard navigation (Tab, Shift+Tab)</li>
              <li>Escape key to close</li>
              <li>Click outside to close</li>
              <li>Focus management</li>
              <li>Accessibility support</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        title="Confirm Action"
        variant="danger"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={confirmModal.closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmAction}>
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm font-medium">⚠️ Warning</p>
            <p className="text-red-700 text-sm">
              This will permanently delete the selected item and all associated data.
            </p>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        title="Create New Item"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={formModal.closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="item-form" variant="primary">
              Create Item
            </Button>
          </>
        }
      >
        <form id="item-form" onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SKU-001"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" className="rounded" />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Mark as featured item
            </label>
          </div>
        </form>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModal.isOpen}
        onClose={successModal.closeModal}
        title="Success!"
        variant="success"
        size="sm"
        footer={
          <Button variant="success" onClick={successModal.closeModal}>
            Close
          </Button>
        }
      >
        <p>Your action has been completed successfully!</p>
      </Modal>

      {/* Warning Modal */}
      <Modal
        isOpen={warningModal.isOpen}
        onClose={warningModal.closeModal}
        title="Important Notice"
        variant="warning"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={warningModal.closeModal}>
              Dismiss
            </Button>
            <Button variant="warning" onClick={warningModal.closeModal}>
              Acknowledge
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p>Please be aware of the following important information:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Your session will expire in 5 minutes</li>
            <li>Unsaved changes will be lost</li>
            <li>Please save your work before continuing</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default Modal;
