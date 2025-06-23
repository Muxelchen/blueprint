import { create } from 'zustand';

// Zustand store for global state management
interface AppState {
  isDarkMode: boolean;
  user: { name: string; email: string } | null;
  notifications: number;
  sidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  toggleDarkMode: () => void;
  setUser: (user: { name: string; email: string } | null) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
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

// Initialize sidebar collapsed state from localStorage
const getInitialSidebarCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState !== null) {
    return JSON.parse(savedState);
  }
  
  return false; // Default to expanded
};

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: getInitialDarkMode(),
  user: { name: 'John Doe', email: 'john@example.com' },
  notifications: 3,
  sidebarCollapsed: getInitialSidebarCollapsed(),
  isMobileSidebarOpen: false,
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
  setUser: user => set({ user }),
  incrementNotifications: () => set(state => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 }),
  toggleSidebarCollapsed: () => {
    const newState = !get().sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    set({ sidebarCollapsed: newState });
  },
  setSidebarCollapsed: (collapsed: boolean) => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    set({ sidebarCollapsed: collapsed });
  },
  toggleMobileSidebar: () => set(state => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setMobileSidebarOpen: (open: boolean) => set({ isMobileSidebarOpen: open }),
}));
