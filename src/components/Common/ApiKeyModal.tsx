import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink } from 'lucide-react';
import { isValidApiKey, sanitizeUserInput } from '../../utils/sanitize';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [val, setVal] = useState(apiKey);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVal(apiKey);
    setError(null);
  }, [apiKey, isOpen]);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeUserInput(val.trim(), 100);
    if (sanitized && !isValidApiKey(sanitized)) {
      setError('Key format looks invalid. Please check your Gemini API key from Google AI Studio.');
      return;
    }
    setError(null);
    onSaveKey(sanitized);
    onClose();
  };

  const handleClear = () => {
    setVal('');
    onSaveKey('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-600" aria-hidden="true" />
            <h2 id="api-key-modal-title" className="font-bold text-base text-slate-900 dark:text-white">
              Google Gemini API Configuration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          AeroPulse AI includes a zero-latency, full-capability <strong>Offline Environmental Science Engine</strong> that runs locally without an API key. To unlock real-time generative dialogue powered by Google Gemini 1.5 Flash, enter your key below.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gemini-key-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Google Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              placeholder="AIzaSy..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <span>Get a free Gemini API Key</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <span className="text-[11px] text-slate-400">Stored only in your browser</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                Clear Key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              Save Key
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
