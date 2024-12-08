"use client"

import React, { useEffect, useState } from 'react';
import './toast.css';
import { useToast } from "@/app/ui/use-toast"
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Draggable from 'react-draggable';

const DraggableComponent = Draggable as any;

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
  const toastRefs = React.useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  useEffect(() => {
    toasts.forEach(toast => {
      if (!toastRefs.current[toast.id]) {
        toastRefs.current[toast.id] = React.createRef();
      }
    });
  }, [toasts]);

  const handleClose = (id: string) => {
    setVisibleToasts(current => current.filter(t => t.id !== id));
  };

  if (!mounted) return null;

  const toastContent = (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {visibleToasts.map(({ id, title, description, expiresAt }) => (
        <DraggableComponent 
          key={id} 
          handle=".drag-handle"
          nodeRef={toastRefs.current[id]}
        >
          <div
            ref={toastRefs.current[id]}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 border border-gray-300 rounded-lg shadow-lg p-4 min-w-[300px] toast-enter pointer-events-auto"
            style={{ zIndex: 9999 }}
          >
            <div className="drag-handle cursor-move pb-2 text-gray-400 text-xs text-center select-none">
              Drag to move
            </div>
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
        </DraggableComponent>
      ))}
    </div>
  );

  return createPortal(toastContent, document.body);
} 