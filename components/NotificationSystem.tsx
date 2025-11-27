import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface NotificationContextType {
  showToast: (message: string, type?: NotificationType) => void;
  confirm: (options: ConfirmationOptions) => void;
}

// --- Context ---
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// --- Components ---

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const borderColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center w-full max-w-sm p-4 mb-4 text-gray-500 bg-white rounded shadow-lg border-l-4 ${borderColors[toast.type]}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50">
        {icons[toast.type]}
      </div>
      <div className="ml-3 text-sm font-normal text-gray-800">{toast.message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
        onClick={() => onClose(toast.id)}
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

// --- Provider ---
import { useEffect } from 'react';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmation, setConfirmation] = useState<ConfirmationOptions | null>(null);

  const showToast = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const confirm = useCallback((options: ConfirmationOptions) => {
    setConfirmation(options);
  }, []);

  const handleConfirm = () => {
    if (confirmation) {
      confirmation.onConfirm();
      setConfirmation(null);
    }
  };

  const handleCancel = () => {
    setConfirmation(null);
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Toast Container */}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
           <div className="pointer-events-auto">
             <AnimatePresence>
                {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </AnimatePresence>
           </div>
        </div>,
        document.body
      )}

      {/* Confirmation Modal */}
      {confirmation && createPortal(
        <AnimatePresence>
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-carbon-900/60 backdrop-blur-sm"
              onClick={handleCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md shadow-2xl rounded-sm overflow-hidden p-6"
            >
                <div className="flex items-start mb-4">
                    <div className={`p-3 rounded-full mr-4 ${confirmation.isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-primary-600'}`}>
                        {confirmation.isDestructive ? <Trash2 className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6"/>}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{confirmation.title}</h3>
                        <p className="text-sm text-gray-500">{confirmation.message}</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button 
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
                    >
                        {confirmation.cancelText || 'Cancelar'}
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-sm shadow-sm transition-all ${
                            confirmation.isDestructive 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-primary-600 hover:bg-primary-700'
                        }`}
                    >
                        {confirmation.confirmText || 'Confirmar'}
                    </button>
                </div>
            </motion.div>
           </div>
        </AnimatePresence>,
        document.body
      )}

    </NotificationContext.Provider>
  );
};