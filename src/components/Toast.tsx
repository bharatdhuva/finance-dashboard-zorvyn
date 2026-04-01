import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'error' | 'teal';

interface ToastData {
  message: string;
  type: ToastType;
  id: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const typeStyles: Record<ToastType, string> = {
  success: 'bg-emerald-600 border-emerald-500',
  info: 'bg-blue-600 border-blue-500',
  error: 'bg-red-600 border-red-500',
  teal: 'bg-cyan-600 border-cyan-500',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => setToast((prev) => (prev?.id === id ? null : prev)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium shadow-lg animate-slide-in-right ${typeStyles[toast.type]}`}
          style={{ color: 'white' }}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
