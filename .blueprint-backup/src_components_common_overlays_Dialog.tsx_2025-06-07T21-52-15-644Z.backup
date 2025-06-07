import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, HelpCircle } from 'lucide-react';
import Button from '../buttons/Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  type?: 'info' | 'warning' | 'danger' | 'success' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = true,
  isLoading = false,
  size = 'sm',
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const variantClasses = {
    info: {
      icon: 'text-blue-600',
      title: 'text-blue-900',
      description: 'text-blue-700',
    },
    warning: {
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      description: 'text-yellow-700',
    },
    danger: {
      icon: 'text-red-600',
      title: 'text-red-900',
      description: 'text-red-700',
    },
    success: {
      icon: 'text-green-600',
      title: 'text-green-900',
      description: 'text-green-700',
    },
    confirm: {
      icon: 'text-blue-600',
      title: 'text-blue-900',
      description: 'text-blue-700',
    },
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6" />;
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6" />;
      case 'info':
        return <Info className="w-6 h-6" />;
      case 'confirm':
        return <HelpCircle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getButtonVariant = () => {
    const variants = {
      info: 'primary',
      warning: 'warning',
      danger: 'danger',
      success: 'success',
      confirm: 'primary',
    } as const;
    return variants[type];
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Dialog */}
      <div
        className={`
          relative bg-white rounded-lg shadow-xl w-full p-6 transform transition-all
          ${sizeClasses[size]}
          ${className}
        `}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Content */}
        <div className="text-center space-y-4">
          {/* Icon */}
          {getDefaultIcon() && (
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              <span className={variantClasses[type].icon}>{getDefaultIcon()}</span>
            </div>
          )}

          {/* Title */}
          <h3 id="dialog-title" className={`text-lg font-semibold ${variantClasses[type].title}`}>
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p id="dialog-description" className={`text-sm ${variantClasses[type].description}`}>
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-3">
          {showCancel && (
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
          )}
          <Button variant={getButtonVariant()} onClick={onConfirm || onClose} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook for dialog state management
export const useDialog = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    type: 'info' | 'warning' | 'danger' | 'success' | 'confirm';
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    type: 'info',
  });

  const showDialog = (config: {
    title: string;
    description?: string;
    type?: 'info' | 'warning' | 'danger' | 'success' | 'confirm';
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
  }) => {
    setDialogState({
      isOpen: true,
      type: 'info',
      showCancel: true,
      confirmText: 'OK',
      cancelText: 'Cancel',
      ...config,
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false, isLoading: false }));
  };

  const setLoading = (loading: boolean) => {
    setDialogState(prev => ({ ...prev, isLoading: loading }));
  };

  const handleConfirm = async () => {
    if (dialogState.onConfirm) {
      setLoading(true);
      try {
        await dialogState.onConfirm();
        closeDialog();
      } catch (error) {
        setLoading(false);
        // Handle error if needed
      }
    } else {
      closeDialog();
    }
  };

  return {
    dialogState,
    showDialog,
    closeDialog,
    handleConfirm,
    setLoading,
  };
};

// Example usage with different dialog types
export const ExampleDialogs: React.FC = () => {
  const dialog = useDialog();
  const [result, setResult] = useState<string>('');

  const showInfoDialog = () => {
    dialog.showDialog({
      title: 'Information',
      description:
        'This is an informational message. Please take note of this important information.',
      type: 'info',
      showCancel: false,
      confirmText: 'Got it',
    });
  };

  const showWarningDialog = () => {
    dialog.showDialog({
      title: 'Warning',
      description: 'This action may have unintended consequences. Please proceed with caution.',
      type: 'warning',
      confirmText: 'Proceed',
      onConfirm: () => {
        setResult('Warning acknowledged');
      },
    });
  };

  const showDangerDialog = () => {
    dialog.showDialog({
      title: 'Delete Confirmation',
      description: 'Are you sure you want to delete this item? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult('Item deleted successfully');
      },
    });
  };

  const showSuccessDialog = () => {
    dialog.showDialog({
      title: 'Success!',
      description: 'Your operation has been completed successfully.',
      type: 'success',
      showCancel: false,
      confirmText: 'Great!',
    });
  };

  const showConfirmDialog = () => {
    dialog.showDialog({
      title: 'Confirm Action',
      description: 'Do you want to save your changes before continuing?',
      type: 'confirm',
      confirmText: 'Save',
      cancelText: "Don't Save",
      onConfirm: () => {
        setResult('Changes saved');
      },
    });
  };

  const showAsyncDialog = () => {
    dialog.showDialog({
      title: 'Process Data',
      description: 'This will process all your data. It may take a few moments.',
      type: 'confirm',
      confirmText: 'Process',
      onConfirm: async () => {
        // Simulate long-running operation
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResult('Data processed successfully');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button onClick={showInfoDialog} variant="primary">
          Info Dialog
        </Button>

        <Button onClick={showWarningDialog} variant="warning">
          Warning Dialog
        </Button>

        <Button onClick={showDangerDialog} variant="danger">
          Danger Dialog
        </Button>

        <Button onClick={showSuccessDialog} variant="success">
          Success Dialog
        </Button>

        <Button onClick={showConfirmDialog} variant="secondary">
          Confirm Dialog
        </Button>

        <Button onClick={showAsyncDialog} variant="primary">
          Async Dialog
        </Button>
      </div>

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            <strong>Result:</strong> {result}
          </p>
          <button
            onClick={() => setResult('')}
            className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Dialog Component */}
      <Dialog
        isOpen={dialog.dialogState.isOpen}
        onClose={dialog.closeDialog}
        onConfirm={dialog.handleConfirm}
        title={dialog.dialogState.title}
        description={dialog.dialogState.description}
        type={dialog.dialogState.type}
        confirmText={dialog.dialogState.confirmText}
        cancelText={dialog.dialogState.cancelText}
        showCancel={dialog.dialogState.showCancel}
        isLoading={dialog.dialogState.isLoading}
      />
    </div>
  );
};

export default Dialog;
