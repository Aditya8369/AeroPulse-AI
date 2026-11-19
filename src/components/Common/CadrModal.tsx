import React from 'react';
import { X } from 'lucide-react';
import { CorsiRosenthalCalculator } from '../IAQLab/CorsiRosenthalCalculator';

interface CadrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CadrModal: React.FC<CadrModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          <button
            onClick={onClose}
            aria-label="Close CADR Calculator"
            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <CorsiRosenthalCalculator />
        </div>
      </div>
    </div>
  );
};
