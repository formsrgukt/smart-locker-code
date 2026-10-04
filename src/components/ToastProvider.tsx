"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration: number;
  isClosing: boolean;
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const MARKS = {
  success: <path className="mark" d="M11 17.5l4.2 4.2L23 12.5" />,
  error: <path className="mark" d="M12.5 12.5l9 9M21.5 12.5l-9 9" />,
  info: <path className="mark" d="M17 16v6.5M17 11.8v.4" />,
  warn: <path className="mark" d="M17 11.5v6.5M17 22v.4" />
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((title: string, message: string, type: ToastType = 'success', duration: number = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration, isClosing: false }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, isClosing: true } : t));
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toasts" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type} ${toast.isClosing ? 'out' : ''}`}
            role="status"
            style={{ '--d': `${toast.duration}ms` } as React.CSSProperties}
            onAnimationEnd={(e) => {
              if (toast.isClosing && e.animationName === 'out') {
                removeToast(toast.id);
              }
            }}
          >
            <div className="icon">
              <svg viewBox="0 0 34 34">
                <circle cx="17" cy="17" r="16" />
                {MARKS[toast.type]}
              </svg>
            </div>
            <div className="body">
              <div className="title">{toast.title}</div>
              <div className="msg">{toast.message}</div>
            </div>
            <button className="close" aria-label="Dismiss" onClick={() => closeToast(toast.id)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
            <div className="bar" onAnimationEnd={() => closeToast(toast.id)}></div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
