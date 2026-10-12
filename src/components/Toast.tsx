import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-emerald-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-blue-600';

  const icon =
    type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white text-sm font-medium shadow-2xl transition-all duration-300 ${bgColor} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{message}</span>
    </div>
  );
}
