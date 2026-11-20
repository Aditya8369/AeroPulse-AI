import React, { useState, useMemo } from 'react';
import { SunMedium, ShieldCheck } from 'lucide-react';
import { CityAirData, DiurnalHourlyPrediction } from '../../types/aqi';
import { calculateInversionLiftTime } from '../../services/aqiService';

interface ThermalInversionGraphProps {
  cityData: CityAirData;
}

export const ThermalInversionGraph: React.FC<ThermalInversionGraphProps> = ({ cityData }) => {
  const [selectedHour, setSelectedHour] = useState<DiurnalHourlyPrediction | null>(
    cityData.hourlyForecast[3] || cityData.hourlyForecast[0]
  );

  const liftWindow = useMemo(() => calculateInversionLiftTime(cityData.hourlyForecast), [cityData.hourlyForecast]);
  const maxPM25 = useMemo(() => Math.max(...cityData.hourlyForecast.map(h => h.predictedPM25), 300), [cityData.hourlyForecast]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SunMedium className="w-5 h-5 text-amber-500" aria-hidden="true" />
            Diurnal Thermal Inversion & Ventilation Windows
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hour-by-hour boundary layer compression. Ground pollution spikes early morning and drops during midday solar heating.
          </p>
        </div>

        {/* Quick safe indicator badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>Optimal Airing Window: <strong>{liftWindow.startHour} – {liftWindow.endHour}</strong></span>
        </div>
      </div>

      {/* Hourly Chart Bar Visualization */}
      <div className="my-6">
        <div 
          className="grid grid-cols-5 sm:grid-cols-9 gap-2 sm:gap-3 items-end h-56 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800"
          role="region"
          aria-label="Hourly diurnal air quality forecast"
        >
          {cityData.hourlyForecast.map((hour) => {
            const heightPercent = Math.max(15, Math.round((hour.predictedPM25 / maxPM25) * 100));
            const isSelected = selectedHour?.hour === hour.hour;
            const isSafe = hour.isVentilationSafe;

            return (
              <button
                key={hour.hour}
                type="button"
                onClick={() => setSelectedHour(hour)}
                aria-pressed={isSelected}
                className={`group flex flex-col items-center justify-end h-full transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-t-lg ${
                  isSelected ? 'scale-105' : 'hover:opacity-90'
                }`}
                aria-label={`${hour.label}: PM2.5 ${hour.predictedPM25} µg/m³, ${isSafe ? 'Safe window' : 'Inversion trapped'}`}
              >
                {/* Micro tooltip pill on hover */}
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 opacity-80 group-hover:opacity-100">
                  {hour.predictedPM25}
                </span>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 relative ${
                    isSelected ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                  } ${
                    isSafe
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 dark:from-emerald-700 dark:to-teal-500'
                      : hour.inversionStrength === 'High'
                      ? 'bg-gradient-to-t from-red-800 to-rose-600 dark:from-red-950 dark:to-rose-700'
                      : 'bg-gradient-to-t from-orange-600 to-amber-500'
                  }`}
                >
                  {isSafe && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>

                {/* Hour Label */}
                <span className={`text-[11px] font-bold mt-2 ${
                  isSelected 
                    ? 'text-sky-600 dark:text-sky-400 font-extrabold' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {hour.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-3 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-700 inline-block" aria-hidden="true" />
            <span>High Inversion Trapping (Keep sealed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" aria-hidden="true" />
            <span>Moderate Inversion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block" aria-hidden="true" />
            <span>Solar Lift (Safe for 15-min airing)</span>
          </div>
        </div>
      </div>

      {/* Selected Hour Details Callout */}
      {selectedHour && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Forecast for <strong>{selectedHour.label}</strong>:</span>
              <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                selectedHour.isVentilationSafe 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {selectedHour.isVentilationSafe ? 'Optimal Airing Window' : `Inversion: ${selectedHour.inversionStrength}`}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              {selectedHour.activityRecommendation}
            </p>
          </div>
          <div className="font-mono text-right shrink-0">
            <div className="text-slate-400">Predicted PM2.5</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {selectedHour.predictedPM25} µg/m³
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
