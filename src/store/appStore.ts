import { create } from 'zustand'

// Zustand store for global state management
interface AppState {
  isDarkMode: boolean
  user: { name: string; email: string } | null
  notifications: number
  toggleDarkMode: () => void
  setUser: (user: { name: string; email: string } | null) => void
  incrementNotifications: () => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  user: { name: 'John Doe', email: 'john@example.com' },
  notifications: 3,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setUser: (user) => set({ user }),
  incrementNotifications: () => set((state) => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 }),
}))