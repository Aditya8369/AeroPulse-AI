import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  AlertTriangle, 
  Info 
} from 'lucide-react';
import { ScheduledActivity } from '../../types/routine';
import { CityAirData, UserFamilyProfile } from '../../types/aqi';

interface RoutineSchedulerProps {
  activities: ScheduledActivity[];
  onToggleActivity: (id: string) => void;
  cityData: CityAirData;
  profile: UserFamilyProfile;
}

export const RoutineScheduler: React.FC<RoutineSchedulerProps> = ({
  activities,
  onToggleActivity,
  cityData,
  profile,
}) => {
  const adoptedCount = activities.filter(a => a.isAdopted).length;
  const totalCO2SavedGrams = activities
    .filter(a => a.isAdopted)
    .reduce((sum, a) => sum + a.emissionReductionGramsCO2, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
            Diurnal Exposure Defense
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Low-Emission Daily Routines & Inversion Timing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Timed against {cityData.cityName}'s winter thermal boundary cycle. Shifting habits during peak ground stagnation drastically cuts deep-lung particulate deposition while reducing urban carbon emissions.
          </p>
        </div>

        {/* Routine Score Pill */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shrink-0">
          <div className="p-2.5 rounded-lg bg-sky-600 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Protections</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {adoptedCount} / {activities.length} Adopted
            </div>
            {totalCO2SavedGrams > 0 && (
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                {(totalCO2SavedGrams / 1000).toFixed(2)} kg CO2/day avoided
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {activities.map((act) => {
          const isAdopted = act.isAdopted;
          return (
            <div
              key={act.id}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                isAdopted
                  ? 'bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-600 shadow-sm ring-1 ring-sky-400/20'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Left: Time & Activity Name */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => onToggleActivity(act.id)}
                    aria-label={`Toggle adoption for ${act.activityName}`}
                    aria-pressed={isAdopted}
                    className={`mt-1 p-1 rounded-full transition-colors cursor-pointer ${
                      isAdopted
                        ? 'text-sky-600 dark:text-sky-400 hover:text-sky-700'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {isAdopted ? (
                      <CheckCircle2 className="w-6 h-6 fill-sky-600/20" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Clock className="w-3 h-3 text-sky-500" />
                        {act.timeSlot}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {act.activityName}
                      </h3>
                      {act.exposureReductionPercentage > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          -{act.exposureReductionPercentage}% PM2.5 Inhaled
                        </span>
                      )}
                      {act.emissionReductionGramsCO2 > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                          -{(act.emissionReductionGramsCO2 / 1000).toFixed(1)}kg CO2
                        </span>
                      )}
                    </div>

                    {/* Comparison Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                          Standard Winter Habit:
                        </span>
                        {act.defaultHabit}
                      </div>

                      <div className="p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        <span className="font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider text-[10px] block mb-1">
                          ✨ AeroPulse Low-Emission Alternative:
                        </span>
                        {act.recommendedAlternative}
                      </div>
                    </div>

                    {/* Scientific Reason */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{act.reason}</span>
                    </p>

                    {/* Vulnerability Alert if tailored */}
                    {act.vulnerabilitySpecificTip && profile.householdMembers.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span><strong>Household Tip:</strong> {act.vulnerabilitySpecificTip}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Toggle Button */}
                <div className="sm:self-center shrink-0">
                  <button
                    onClick={() => onToggleActivity(act.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isAdopted
                        ? 'bg-sky-600 text-white shadow-sm hover:bg-sky-700'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isAdopted ? 'Plan Adopted ✓' : '+ Adopt Habit'}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
