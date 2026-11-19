import React from 'react';
import { 
  TrendingUp, 
  Cigarette, 
  Leaf, 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  Share2, 
  Check 
} from 'lucide-react';
import { ImpactMetrics } from '../../types/impact';
import { CityAirData } from '../../types/aqi';

interface PersonalImpactMetricsProps {
  metrics: ImpactMetrics;
  cityData: CityAirData;
}

export const PersonalImpactMetrics: React.FC<PersonalImpactMetricsProps> = ({
  metrics,
  cityData,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    const text = `I just avoided inhaling ~${metrics.totalPM25AvoidedMicrograms}µg of toxic PM2.5 (equivalent to un-smoking ${metrics.cigarettesEquivalenceSaved} cigarettes!) using AeroPulse AI in ${cityData.cityName}. Check your clean air impact:`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
            Berkeley Earth & Environmental Health Metrics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Your Quantified Clean Air Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            See exactly how adopting low-emission routines and indoor filtration hacks shifts your daily toxic burden in {cityData.cityName}.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Impact Copied!' : 'Share Milestone'}</span>
        </button>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cigarette Equivalence Card */}
        <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 dark:from-rose-950/40 dark:to-orange-950/40 p-5 rounded-2xl border border-rose-200 dark:border-rose-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Cigarette Equiv. Saved
            </span>
            <Cigarette className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {metrics.cigarettesEquivalenceSaved} <span className="text-sm font-normal text-slate-500">cigs/day</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            Based on Berkeley Earth formula (~22 µg/m³ PM2.5 in 24h = 1 cigarette).
          </p>
        </div>

        {/* PM2.5 Inhalation Avoided */}
        <div className="bg-gradient-to-br from-sky-500/10 to-teal-500/10 dark:from-sky-950/40 dark:to-teal-950/40 p-5 rounded-2xl border border-sky-200 dark:border-sky-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
              PM2.5 Inhalation Avoided
            </span>
            <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {metrics.totalPM25AvoidedMicrograms} <span className="text-sm font-normal text-slate-500">µg</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            Toxic soot and heavy metals prevented from penetrating deep alveoli.
          </p>
        </div>

        {/* CO2 Emissions Prevented */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-950/40 dark:to-green-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Community CO2 Avoided
            </span>
            <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {metrics.co2EmissionsSavedKg} <span className="text-sm font-normal text-slate-500">kg CO2</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            Achieved via green transit shifts and clean kitchen cooking timing.
          </p>
        </div>

        {/* Indoor Air Purity Boost */}
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/40 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
              Home Air Purity Lift
            </span>
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            +{metrics.indoorAQIImprovementPercent}% <span className="text-sm font-normal text-slate-500">cleaner</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            Indoor sanctuary vs outdoor ambient hazardous smog concentration.
          </p>
        </div>

      </div>

      {/* Health Risk Reduction Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-sky-600" />
          Clinical & Biological Health Dividend
        </h3>

        <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          {metrics.healthRiskReductionSummary}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Short-Term (24h - 48h)
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Reduces acute airway hyper-reactivity, throat burning, morning wheezing, and nocturnal dry cough by maintaining nasal mucosal hydration.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Medium-Term (1-3 Months)
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Prevents systemic vascular inflammation, stabilizes blood pressure during cold fronts, and protects developing lung volume in school-aged children.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Community Dividend
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Carpooling and non-burning practices lower the localized ground-level toxic peak for adjacent schools, daycare centers, and hospital perimeters.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
