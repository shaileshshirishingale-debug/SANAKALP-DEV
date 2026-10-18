import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#31302d] text-[#f3f0eb] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 border border-[#dfc0b7]/20">
      <span className="material-symbols-outlined text-[#fe932c] text-xl">{icon}</span>
      <span className="text-xs font-semibold">{message}</span>
    </div>
  );
};
