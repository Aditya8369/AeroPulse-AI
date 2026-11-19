import React from 'react';
import { Wind, ShieldAlert, Sun, Moon, Eye, Key, Users } from 'lucide-react';
import { CityAirData, UserFamilyProfile } from '../types/aqi';
import { CITIES_DATA } from '../data/cities';

interface HeaderProps {
  currentCity: CityAirData;
  onSelectCity: (cityId: string) => void;
  profile: UserFamilyProfile;
  onOpenProfile: () => void;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  profile,
  onOpenProfile,
  onOpenApiKeyModal,
  hasCustomKey,
  highContrast,
  onToggleHighContrast,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white shadow-md shadow-sky-500/20 ring-1 ring-white/20">
              <Wind className="w-6 h-6 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-teal-300">
                  AeroPulse AI
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Winter Smog Copilot
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Hyperlocal smog defense, low-emission routines & clean indoor sanctuary hacks
              </p>
            </div>
          </div>

          {/* Quick Controls: City selector, Profile, A11y, API key */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Selector */}
            <div className="relative">
              <label htmlFor="city-select" className="sr-only">Select Urban Location</label>
              <select
                id="city-select"
                value={currentCity.cityId}
                onChange={(e) => onSelectCity(e.target.value)}
                className="text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-1.5 px-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer shadow-sm"
              >
                {Object.values(CITIES_DATA).map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    📍 {city.cityName} ({city.country}) - AQI {city.currentAQI}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Pill */}
            <button
              onClick={onOpenProfile}
              aria-label="Edit Household Profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
              title="Configure Household Profile & Vulnerability Cohorts"
            >
              <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden md:inline">Profile</span>
              {profile.householdMembers.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {profile.householdMembers.length}
                </span>
              )}
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              aria-label="Configure Gemini API Key"
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                hasCustomKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
              title={hasCustomKey ? "Gemini API Connected" : "Connect Gemini Live Key (Optional)"}
            >
              <Key className="w-4 h-4" />
            </button>

            {/* High Contrast Toggle (Accessibility) */}
            <button
              onClick={onToggleHighContrast}
              aria-label={highContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
              aria-pressed={highContrast}
              className={`p-2 rounded-lg border transition-colors ${
                highContrast
                  ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
              title="WCAG High Contrast Toggle"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>
        </div>

        {/* Severe Inversion Alert Banner */}
        {currentCity.inversionLayerActive && (
          <div 
            role="alert" 
            aria-live="polite"
            className="mb-3 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 flex items-center justify-between text-xs sm:text-sm animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 animate-bounce" />
              <span>
                <strong>Severe Winter Thermal Inversion Active:</strong> Ground boundary ceiling compressed to {currentCity.thermalInversionHeightMeters}m. Toxic emissions trapped near street level. Avoid early morning outdoor exercise.
              </span>
            </div>
            <span className="hidden lg:inline-block font-mono text-xs bg-red-200/50 dark:bg-red-900/50 px-2 py-0.5 rounded">
              Lid: {currentCity.thermalInversionHeightMeters}m
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
