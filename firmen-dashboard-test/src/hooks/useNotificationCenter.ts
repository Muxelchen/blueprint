import { useState, useCallback } from 'react';

export interface UseNotificationCenterReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  unreadCount: number;
}

export const useNotificationCenter = (): UseNotificationCenterReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // This would integrate with your notification system to get the actual unread count
  // For now, returning a placeholder
  const unreadCount = 0; // You can integrate this with your notification hooks

  return {
    isOpen,
    open,
    close,
    toggle,
    unreadCount,
  };
};
