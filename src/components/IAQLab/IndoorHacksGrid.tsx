import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  FlaskConical 
} from 'lucide-react';
import { INDOOR_AIR_HACKS } from '../../data/hacksData';

export const IndoorHacksGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedHackId, setExpandedHackId] = useState<string | null>(INDOOR_AIR_HACKS[0].id);

  const categories = ['All', 'DIY Filter', 'Ventilation', 'Cooking', 'Humidity', 'Plants', 'Sealing'];

  const filteredHacks = useMemo(() => {
    return selectedCategory === 'All'
      ? INDOOR_AIR_HACKS
      : INDOOR_AIR_HACKS.filter(h => h.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Category Filter Chips */}
      <div 
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        role="group"
        aria-label="Filter indoor air quality hacks by category"
      >
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Filter Hacks:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={isSelected}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Hacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHacks.map((hack) => {
          const isExpanded = expandedHackId === hack.id;

          return (
            <div
              key={hack.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-5 ${
                isExpanded
                  ? 'border-sky-400 dark:border-sky-600 shadow-sm ring-1 ring-sky-400/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {hack.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {hack.costLevel}
                    </span>
                    {hack.effectivenessPercent > 10 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                        ~{hack.effectivenessPercent}% Reduction
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white pt-1">
                    {hack.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                  aria-expanded={isExpanded}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline shrink-0 p-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {isExpanded ? 'Collapse ▲' : 'Details ▼'}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {hack.summary}
              </p>

              {/* Expanded Deep Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs animate-fade-in">
                  
                  {/* Detailed Steps */}
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] mb-2">
                      Implementation Steps:
                    </h5>
                    <div className="space-y-1.5 pl-1">
                      {hack.detailedSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-slate-700 dark:text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Myth Buster Box */}
                  {hack.mythBuster && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                      <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                        💡 Myth vs. Reality
                      </span>
                      <p className="text-slate-800 dark:text-slate-200">{hack.mythBuster}</p>
                    </div>
                  )}

                  {/* Scientific Citation */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <FlaskConical className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold text-[10px] uppercase tracking-wider block text-slate-500">
                        Peer-Reviewed Evidence:
                      </span>
                      <span>{hack.scienceBacking}</span>
                    </div>
                  </div>

                  {/* Warning */}
                  {hack.warningNote && (
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
                      <span>{hack.warningNote}</span>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
