import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NotificationsProvider } from './hooks/useNotifications';
import { ToastProvider } from './components/common/feedback/ToastNotification';
import { ProgressNotificationProvider } from './components/common/feedback/ProgressNotification';
import App from './App.tsx';
import './index.css';

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
            className: 'bg-surface text-text-primary border-border',
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'var(--success)',
                secondary: 'var(--text-on-primary)',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: 'var(--error)',
                secondary: 'var(--text-on-primary)',
              },
            },
          }}
        />
      </NotificationsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
