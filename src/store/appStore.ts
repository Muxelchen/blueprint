import { create } from 'zustand';

// Zustand store for global state management
interface AppState {
  isDarkMode: boolean;
  user: { name: string; email: string } | null;
  notifications: number;
  toggleDarkMode: () => void;
  setUser: (user: { name: string; email: string } | null) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;
}

// Initialize dark mode from localStorage or system preference
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    return JSON.parse(savedMode);
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useAppStore = create<AppState>(set => ({
  isDarkMode: getInitialDarkMode(),
  user: { name: 'John Doe', email: 'john@example.com' },
  notifications: 3,
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
  setUser: user => set({ user }),
  incrementNotifications: () => set(state => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 }),
}));
