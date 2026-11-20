import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { AQIGauge } from './components/Dashboard/AQIGauge';
import { ThermalInversionGraph } from './components/Dashboard/ThermalInversionGraph';
import { VulnerabilityAlert } from './components/Dashboard/VulnerabilityAlert';
import { ChatInterface } from './components/Assistant/ChatInterface';
import { RoutineScheduler } from './components/Routines/RoutineScheduler';
import { CorsiRosenthalCalculator } from './components/IAQLab/CorsiRosenthalCalculator';
import { IndoorHacksGrid } from './components/IAQLab/IndoorHacksGrid';
import { PersonalImpactMetrics } from './components/Impact/PersonalImpactMetrics';
import { CommunityActionHub } from './components/Community/CommunityActionHub';
import { FamilyProfileModal } from './components/Common/FamilyProfileModal';
import { ApiKeyModal } from './components/Common/ApiKeyModal';
import { CadrModal } from './components/Common/CadrModal';

import { CityAirData, UserFamilyProfile } from './types/aqi';
import { ScheduledActivity } from './types/routine';
import { BASE_ROUTINE_ACTIVITIES } from './data/routinesData';
import { getCityAirData } from './services/aqiService';
import { calculateTotalImpact } from './services/impactCalculator';
import { safeLocalStorageGet, safeLocalStorageSet } from './utils/storage';
import { announceToScreenReader } from './utils/a11y';

const DEFAULT_PROFILE: UserFamilyProfile = {
  cityId: 'delhi-ncr',
  householdMembers: ['School-Age Child (5-17)', 'Asthma / COPD / Respiratory'],
  housingType: 'Apartment',
  heatingType: 'Electric Heat Pump',
  cookingFuel: 'Piped Natural Gas',
  commuteMode: 'Gas/Diesel Car',
  hasAirPurifier: true,
  purifierCount: 1,
};

export const App: React.FC = () => {
  // 1. Core State
  const [currentCityId, setCurrentCityId] = useState<string>(() =>
    safeLocalStorageGet('aeropulse_city_id', 'delhi-ncr')
  );
  const [currentCity, setCurrentCity] = useState<CityAirData>(() =>
    getCityAirData(currentCityId)
  );

  const [profile, setProfile] = useState<UserFamilyProfile>(() =>
    safeLocalStorageGet('aeropulse_profile', DEFAULT_PROFILE)
  );

  const [activities, setActivities] = useState<ScheduledActivity[]>(() =>
    safeLocalStorageGet('aeropulse_activities', BASE_ROUTINE_ACTIVITIES)
  );

  const [activeTab, setActiveTab] = useState<TabId>('DASHBOARD');

  // 2. Modals and Settings State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isCadrModalOpen, setIsCadrModalOpen] = useState(false);

  const [apiKey, setApiKey] = useState<string>(() =>
    safeLocalStorageGet('aeropulse_gemini_key', '')
  );

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() =>
    safeLocalStorageGet('aeropulse_high_contrast', false)
  );

  // Sync theme classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    safeLocalStorageSet('aeropulse_high_contrast', highContrast);
  }, [highContrast]);

  // Update city data when city ID changes
  const handleSelectCity = useCallback((cityId: string) => {
    setCurrentCityId(cityId);
    safeLocalStorageSet('aeropulse_city_id', cityId);
    const data = getCityAirData(cityId);
    setCurrentCity(data);
    announceToScreenReader(`Switched location to ${data.cityName}. Current AQI is ${data.currentAQI}.`);
  }, []);

  const handleToggleActivity = useCallback((id: string) => {
    setActivities(prev => {
      const updated = prev.map(act =>
        act.id === id ? { ...act, isAdopted: !act.isAdopted } : act
      );
      safeLocalStorageSet('aeropulse_activities', updated);
      return updated;
    });
    announceToScreenReader('Updated routine adoption. Impact scores recalculated.');
  }, []);

  const handleSaveProfile = useCallback((newProfile: UserFamilyProfile) => {
    setProfile(newProfile);
    safeLocalStorageSet('aeropulse_profile', newProfile);
    announceToScreenReader('Household vulnerability profile saved.');
  }, []);

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key);
    safeLocalStorageSet('aeropulse_gemini_key', key);
    announceToScreenReader('Gemini API key settings updated.');
  }, []);

  // Live impact calculations memoized for efficiency
  const impactMetrics = useMemo(() => {
    return calculateTotalImpact(activities, currentCity.pollutants.pm25);
  }, [activities, currentCity.pollutants.pm25]);

  const adoptedRoutinesCount = useMemo(() => {
    return activities.filter(a => a.isAdopted).length;
  }, [activities]);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    announceToScreenReader(`Switched to tab: ${tab}`);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Skip to Main Content Link for Keyboard and Screen-Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-sky-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={apiKey.trim().length > 10}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(prev => !prev)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeRoutinesCount={adoptedRoutinesCount}
      />

      {/* Main Tab Panels */}
      <main 
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
      >
        
        {/* DASHBOARD TAB */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6 animate-fade-in" id="panel-DASHBOARD" role="tabpanel" aria-labelledby="tab-DASHBOARD">
            <AQIGauge cityData={currentCity} />
            <ThermalInversionGraph cityData={currentCity} />
            <VulnerabilityAlert
              profile={profile}
              cityData={currentCity}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          </div>
        )}

        {/* COPILOT TAB */}
        {activeTab === 'COPILOT' && (
          <div className="animate-fade-in" id="panel-COPILOT" role="tabpanel" aria-labelledby="tab-COPILOT">
            <ChatInterface
              cityData={currentCity}
              profile={profile}
              apiKey={apiKey}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCalculator={() => setIsCadrModalOpen(true)}
            />
          </div>
        )}

        {/* ROUTINES TAB */}
        {activeTab === 'ROUTINES' && (
          <div className="animate-fade-in" id="panel-ROUTINES" role="tabpanel" aria-labelledby="tab-ROUTINES">
            <RoutineScheduler
              activities={activities}
              onToggleActivity={handleToggleActivity}
              cityData={currentCity}
              profile={profile}
            />
          </div>
        )}

        {/* IAQ LAB TAB */}
        {activeTab === 'IAQ_LAB' && (
          <div className="space-y-8 animate-fade-in" id="panel-IAQ_LAB" role="tabpanel" aria-labelledby="tab-IAQ_LAB">
            <CorsiRosenthalCalculator />
            <IndoorHacksGrid />
          </div>
        )}

        {/* IMPACT TAB */}
        {activeTab === 'IMPACT' && (
          <div className="animate-fade-in" id="panel-IMPACT" role="tabpanel" aria-labelledby="tab-IMPACT">
            <PersonalImpactMetrics
              metrics={impactMetrics}
              cityData={currentCity}
            />
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'COMMUNITY' && (
          <div className="animate-fade-in" id="panel-COMMUNITY" role="tabpanel" aria-labelledby="tab-COMMUNITY">
            <CommunityActionHub cityData={currentCity} />
          </div>
        )}

      </main>

      {/* Modals */}
      <FamilyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      <CadrModal
        isOpen={isCadrModalOpen}
        onClose={() => setIsCadrModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <strong>AeroPulse AI</strong> &bull; Winter Smog & Community Clean Air Copilot.
            <span className="block sm:inline sm:ml-2">
              Scientific citations: WHO 2021 Air Quality Guidelines &bull; Berkeley Earth (Muller & Muller) &bull; UC Davis Air Quality Center.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>WCAG 2.1 AA Compliant</span>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:underline text-sky-600 dark:text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              Profile Settings
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="hover:underline text-sky-600 dark:text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              API Key
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
