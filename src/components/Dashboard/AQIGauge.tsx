import React from 'react';
import { ShieldAlert, AlertTriangle, Cigarette, Layers, Flame, Info } from 'lucide-react';
import { CityAirData } from '../../types/aqi';
import { getAQIColorBlindSafeClass } from '../../utils/a11y';
import { calculateCigaretteEquivalence } from '../../services/impactCalculator';

interface AQIGaugeProps {
  cityData: CityAirData;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({ cityData }) => {
  const aqiStyle = getAQIColorBlindSafeClass(cityData.currentAQI);
  const cigaretteEq = calculateCigaretteEquivalence(cityData.pollutants.pm25);

  // Normalization percentage for gauge arc (0-500)
  const percentage = Math.min(100, Math.round((cityData.currentAQI / 500) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Real-Time Ambient Air Quality
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {cityData.cityName}, {cityData.country}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updated {new Date(cityData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" title="Live Sensor Stream Active" />
        </div>
      </div>

      {/* Main Gauge & Smog Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        
        {/* Gauge Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 relative overflow-hidden">
          
          {/* Circular Visual Graphic */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Active AQI Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`${
                  cityData.currentAQI <= 50 ? 'stroke-emerald-500' :
                  cityData.currentAQI <= 100 ? 'stroke-amber-400' :
                  cityData.currentAQI <= 150 ? 'stroke-orange-500' :
                  cityData.currentAQI <= 200 ? 'stroke-rose-500' :
                  cityData.currentAQI <= 300 ? 'stroke-purple-600' : 'stroke-red-900'
                }`}
                strokeWidth="10"
                strokeDasharray={`${(percentage * 251.2) / 100} 251.2`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner text content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase font-bold text-slate-400">US AQI</span>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {cityData.currentAQI}
              </span>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full mt-1 ${aqiStyle.badgeBg} ${aqiStyle.badgeText}`}>
                {cityData.category}
              </span>
            </div>
          </div>

          {/* Equivalence Pill */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 text-xs font-semibold">
            <Cigarette className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>
              Inhaling 24h outdoor air ≈ <strong>{cigaretteEq} cigarettes/day</strong>
            </span>
          </div>

        </div>

        {/* Detailed Pollutants & Inversion Dynamics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Thermal Inversion Status Card */}
          <div className={`p-4 rounded-xl border ${
            cityData.inversionLayerActive
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  Thermal Inversion Dynamics
                  <span className="text-xs font-mono font-medium px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-900/60">
                    {cityData.inversionLayerActive ? 'Trapping Active' : 'Dispersing'}
                  </span>
                </h3>
                <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                  {cityData.inversionLayerActive
                    ? `Atmospheric inversion boundary at ~${cityData.thermalInversionHeightMeters}m is trapping smoke, biomass exhaust, and vehicle soot near the ground. Avoid physical exertion outdoors until solar lift at ~12:30 PM.`
                    : 'Boundary layer is sufficiently high; ambient air mixing is helping disperse particulate matter.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pollutant Micro-grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">PM2.5</span>
                <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1 rounded">Primary</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {cityData.pollutants.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                WHO Safe Limit: 15 µg/m³
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">PM10</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {cityData.pollutants.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Coarse dust & soot
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">NO2</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {cityData.pollutants.no2} <span className="text-xs font-normal text-slate-500">µg/m³</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Vehicular & gas combustion
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Ozone (O3)</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {cityData.pollutants.o3} <span className="text-xs font-normal text-slate-500">ppb</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Photochemical smog
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Temp / RH</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {cityData.temperatureC}°C <span className="text-xs font-normal text-slate-500">/ {cityData.humidityPercent}% RH</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Cold air locks moisture
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Wind Speed</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {cityData.windSpeedKmh} <span className="text-xs font-normal text-slate-500">km/h</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Stagnant airflow
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
