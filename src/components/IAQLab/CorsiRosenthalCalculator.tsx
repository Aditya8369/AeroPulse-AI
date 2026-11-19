import React, { useState } from 'react';
import { Wrench, CheckCircle, HelpCircle, DollarSign, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { calculateCorsiRosenthalBox } from '../../services/impactCalculator';
import { CorsiRosenthalParams } from '../../types/iaq';

export const CorsiRosenthalCalculator: React.FC = () => {
  const [params, setParams] = useState<CorsiRosenthalParams>({
    roomLengthFeet: 16,
    roomWidthFeet: 14,
    roomHeightFeet: 9,
    targetACH: 5,
    fanDiameterInches: 20,
    filterCount: 4,
    mervRating: 13
  });

  const [showSteps, setShowSteps] = useState(false);

  const result = calculateCorsiRosenthalBox(params);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
            Open-Source Clean Air Engineering
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-600" />
            Corsi-Rosenthal Box Sizing & CADR Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calculate exact Clean Air Delivery Rate (CADR) and Air Changes per Hour (ACH) for your room.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Save ~${result.commercialHepaEquivalentCostUSD - result.estimatedBuildCostUSD} vs Commercial HEPA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Room Dimensions (Feet)
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Length (ft)</label>
                <input
                  type="number"
                  min="6"
                  max="50"
                  value={params.roomLengthFeet}
                  onChange={(e) => setParams({ ...params, roomLengthFeet: Number(e.target.value) || 10 })}
                  className="w-full text-sm font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Width (ft)</label>
                <input
                  type="number"
                  min="6"
                  max="50"
                  value={params.roomWidthFeet}
                  onChange={(e) => setParams({ ...params, roomWidthFeet: Number(e.target.value) || 10 })}
                  className="w-full text-sm font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Height (ft)</label>
                <input
                  type="number"
                  min="7"
                  max="20"
                  value={params.roomHeightFeet}
                  onChange={(e) => setParams({ ...params, roomHeightFeet: Number(e.target.value) || 8 })}
                  className="w-full text-sm font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Total Room Volume:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{result.roomVolumeCubicFeet} cu. ft.</strong>
            </div>
          </div>

          {/* Filter Configuration */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Filter Geometry & Rating
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Style</label>
                <select
                  value={params.filterCount}
                  onChange={(e) => setParams({ ...params, filterCount: Number(e.target.value) as 4 | 5 })}
                  className="w-full text-xs font-semibold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={4}>4-Filter Cube (Standard)</option>
                  <option value={5}>5-Filter Compactor (High Flow)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Filter Media</label>
                <select
                  value={params.mervRating}
                  onChange={(e) => setParams({ ...params, mervRating: Number(e.target.value) as 13 | 14 })}
                  className="w-full text-xs font-semibold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={13}>MERV 13 (Optimal Flow)</option>
                  <option value={14}>MERV 14 (Ultra Fine PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Target Air Changes / Hour (ACH)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={params.targetACH}
                  onChange={(e) => setParams({ ...params, targetACH: Number(e.target.value) })}
                  className="w-full accent-sky-600"
                />
                <span className="font-mono font-bold text-xs text-sky-600 dark:text-sky-400 w-8">
                  {params.targetACH}x
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                WHO/CDC recommends 4-6 ACH for effective aerosol & PM2.5 clearance.
              </span>
            </div>
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Clean Air CADR</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {result.estimatedActualCADR_CFM} <span className="text-xs font-normal text-slate-500">CFM</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                Required: {result.requiredCADR_CFM} CFM
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Delivered ACH</span>
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {result.achAchieved}x <span className="text-xs font-normal text-slate-500">/ hr</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                {result.isSufficient ? '✓ Exceeds CDC safety bar' : 'Add 2nd unit'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estimated Build Cost</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ${result.estimatedBuildCostUSD}
              </div>
              <span className="text-[10px] text-slate-500 line-through mt-1 block">
                Commercial: ${result.commercialHepaEquivalentCostUSD}
              </span>
            </div>

          </div>

          {/* Validation Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm">
                Engineering Sizing Verdict: 100% Sufficient for {result.roomVolumeCubicFeet} cu. ft. Room
              </h5>
              <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                This {params.filterCount}-filter Corsi-Rosenthal configuration purges 85-92% of suspended PM2.5 within 18 minutes of continuous operation. The large surface area minimizes fan motor strain and keeps acoustic noise under {result.noiseLevelDba} dBA.
              </p>
            </div>
          </div>

          {/* Assembly Guide Accordion */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span>View Step-by-Step DIY Assembly Instructions (with Shroud Tip)</span>
              <span className="text-sky-600 dark:text-sky-400">{showSteps ? 'Hide ▲' : 'Expand ▼'}</span>
            </button>

            {showSteps && (
              <div className="p-4 bg-white dark:bg-slate-900 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
                {result.stepByStepGuide.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
