import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextType { toasts: Toast[]; addToast: (message: string, type?: ToastType) => void; removeToast: (id: string) => void; }

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const typeColors: Record<ToastType, string> = {
        success: 'var(--success)', error: 'var(--danger)', info: 'var(--accent-light)', warning: 'var(--warning)',
    };
    const typeIcons: Record<ToastType, string> = {
        success: '✓', error: '✕', info: 'ℹ', warning: '⚠',
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className="animate-toast-in glass" style={{ padding: '14px 20px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 300, borderLeft: `3px solid ${typeColors[toast.type]}` }}
                        onClick={() => removeToast(toast.id)}>
                        <span style={{ color: typeColors[toast.type], fontWeight: 700, fontSize: '1.1rem' }}>{typeIcons[toast.type]}</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
