"use client"

import './toast.css';
import { useToast } from "@/components/ui/use-toast"
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

function CountdownTimer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const timeRemaining = new Date(expiresAt).getTime() - now;
      
      if (timeRemaining <= 0) {
        setTimeLeft('Cache expired');
        return;
      }

      const minutes = Math.floor(timeRemaining / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s remaining`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span>{timeLeft}</span>;
}

export function Toaster() {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);
  const [visibleToasts, setVisibleToasts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  const handleClose = (id: string) => {
    setVisibleToasts(current => current.filter(t => t.id !== id));
  };

  if (!mounted) return null;

  const toastContent = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
      {visibleToasts.map(({ id, title, description, expiresAt }) => (
        <div
          key={id}
          className="bg-gray-200 border border-gray-300 rounded-lg shadow-lg p-4 min-w-[300px] toast-enter pointer-events-auto relative"
          style={{ zIndex: 9999 }}
        >
          <button 
            onClick={() => handleClose(id)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
          {title && (
            <div className="font-semibold text-gray-900 pr-6">{title}</div>
          )}
          {description && (
            <div className="text-gray-700 text-sm">
              Showing cached results. <br />
              <CountdownTimer expiresAt={expiresAt} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return createPortal(toastContent, document.body);
} 