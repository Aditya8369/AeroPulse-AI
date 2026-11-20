import React, { useState, useMemo } from 'react';
import { Wrench, DollarSign, ShieldCheck } from 'lucide-react';
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

  const result = useMemo(() => calculateCorsiRosenthalBox(params), [params]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
            Open-Source Clean Air Engineering
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-600" aria-hidden="true" />
            Corsi-Rosenthal Box Sizing & CADR Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calculate exact Clean Air Delivery Rate (CADR) and Air Changes per Hour (ACH) for your room.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <DollarSign className="w-4 h-4 text-emerald-600" aria-hidden="true" />
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
                <label htmlFor="room-length" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Length (ft)</label>
                <input
                  id="room-length"
                  type="number"
                  min="6"
                  max="50"
                  value={params.roomLengthFeet}
                  onChange={(e) => setParams({ ...params, roomLengthFeet: Math.max(1, Number(e.target.value) || 10) })}
                  className="w-full text-sm font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label htmlFor="room-width" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Width (ft)</label>
                <input
                  id="room-width"
                  type="number"
                  min="6"
                  max="50"
                  value={params.roomWidthFeet}
                  onChange={(e) => setParams({ ...params, roomWidthFeet: Math.max(1, Number(e.target.value) || 10) })}
                  className="w-full text-sm font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label htmlFor="room-height" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Height (ft)</label>
                <input
                  id="room-height"
                  type="number"
                  min="7"
                  max="20"
                  value={params.roomHeightFeet}
                  onChange={(e) => setParams({ ...params, roomHeightFeet: Math.max(1, Number(e.target.value) || 8) })}
                  className="w-full text-sm font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                <label htmlFor="filter-style" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Style</label>
                <select
                  id="filter-style"
                  value={params.filterCount}
                  onChange={(e) => setParams({ ...params, filterCount: Number(e.target.value) as 4 | 5 })}
                  className="w-full text-xs font-semibold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={4}>4-Filter Cube (Standard)</option>
                  <option value={5}>5-Filter Compactor (High Flow)</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-merv" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Filter Media</label>
                <select
                  id="filter-merv"
                  value={params.mervRating}
                  onChange={(e) => setParams({ ...params, mervRating: Number(e.target.value) as 13 | 14 })}
                  className="w-full text-xs font-semibold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={13}>MERV 13 (Optimal Flow)</option>
                  <option value={14}>MERV 14 (Ultra Fine PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="target-ach" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Target Air Changes / Hour (ACH)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="target-ach"
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={params.targetACH}
                  onChange={(e) => setParams({ ...params, targetACH: Number(e.target.value) })}
                  className="w-full accent-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
          
          {/* Main CADR Metric Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            result.isSufficient
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-300">
                  Performance Evaluation
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {result.estimatedActualCADR_CFM} <span className="text-sm font-semibold text-slate-500">CFM CADR</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                  Delivers <strong>{result.achAchieved} Air Changes per Hour</strong> in this space (Target: {params.targetACH} ACH).
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  result.isSufficient
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  {result.isSufficient ? '✓ Fully Sufficient' : '⚠ Undersized for Target ACH'}
                </span>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Required: {result.requiredCADR_CFM} CFM
                </div>
              </div>
            </div>
          </div>

          {/* Cost Comparison Metric */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-semibold block">Estimated DIY Build Cost</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                ${result.estimatedBuildCostUSD}
              </div>
              <span className="text-[10px] text-slate-400">1x Box Fan + {params.filterCount}x MERV {params.mervRating} filters</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-semibold block">Commercial HEPA (Same CADR)</span>
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-0.5">
                ${result.commercialHepaEquivalentCostUSD}
              </div>
              <span className="text-[10px] text-slate-400">e.g. 500 CFM industrial units</span>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-500 dark:text-slate-400">
            <span>Acoustics: ~{result.noiseLevelDba} dBA (Quiet office ambient)</span>
            <span>Recommended Filter Replacement: Every {result.filterLifespanMonths} Months</span>
          </div>

          {/* Step-by-Step Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowSteps(!showSteps)}
              aria-expanded={showSteps}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <span>{showSteps ? 'Hide Assembly Instructions' : 'View Step-by-Step Build Instructions (with Shroud Tip)'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Assembly Guide Accordion */}
      {showSteps && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Official Open-Source Corsi-Rosenthal Assembly Protocol
            </h4>
          </div>

          <ol className="list-decimal pl-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            {result.stepByStepGuide.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>

          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200">
            <strong>The Cardboard Shroud Secret:</strong> Box fan corners create turbulent air vortexes that blow air backward through the blades. Adding a circular cardboard face shroud with a 15-inch opening forces all air in a high-velocity forward stream, boosting clean air delivery by <strong>up to 25%</strong> while dropping fan motor noise.
          </div>
        </div>
      )}

    </div>
  );
};
