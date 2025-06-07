import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NotificationsProvider } from './hooks/useNotifications';
import { ToastProvider } from './components/common/feedback/ToastNotification';
import { ProgressNotificationProvider } from './components/common/feedback/ProgressNotification';
import App from './App.tsx';
import './index.css';

// Initialize dark mode from localStorage or system preference
const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem('darkMode');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'true' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

initializeDarkMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationsProvider>
        <ToastProvider>
          <ProgressNotificationProvider>
            <App />
          </ProgressNotificationProvider>
        </ToastProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-gray-800 dark:text-white',
            style: {
              background: 'var(--toast-bg, #363636)',
              color: 'var(--toast-color, #fff)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </NotificationsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
