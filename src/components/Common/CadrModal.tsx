import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CorsiRosenthalCalculator } from '../IAQLab/CorsiRosenthalCalculator';

interface CadrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CadrModal: React.FC<CadrModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Corsi-Rosenthal CADR Calculator"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close CADR Calculator"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <CorsiRosenthalCalculator />
        </div>
      </div>
    </div>
  );
};
