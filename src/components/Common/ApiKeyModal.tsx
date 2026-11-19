import React, { useState } from 'react';
import { Key, X, Check, ExternalLink } from 'lucide-react';
import { isValidApiKey } from '../../utils/sanitize';

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

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = val.trim();
    if (trimmed && !isValidApiKey(trimmed)) {
      setError('Key format looks invalid. Please check your Gemini API key from Google AI Studio.');
      return;
    }
    setError(null);
    onSaveKey(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Connect Google Gemini Live API
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Note:</strong> AeroPulse AI includes an extensive built-in offline Environmental Science Engine that works completely free out-of-the-box. Providing a Gemini API key is optional and enables real-time conversational reasoning with Gemini 1.5 Flash.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
            {error && (
              <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">
                {error}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              Get free key on Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
            {val && (
              <button
                type="button"
                onClick={() => setVal('')}
                className="text-rose-500 hover:underline"
              >
                Clear Key
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
