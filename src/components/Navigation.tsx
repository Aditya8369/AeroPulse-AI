import React from 'react';
import { 
  Activity, 
  Bot, 
  CalendarClock, 
  Wrench, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { handleTabKeyNavigation } from '../utils/a11y';

export type TabId = 'DASHBOARD' | 'COPILOT' | 'ROUTINES' | 'IAQ_LAB' | 'IMPACT' | 'COMMUNITY';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  activeRoutinesCount: number;
}

const TABS: Array<{ id: TabId; label: string; icon: typeof Activity; badge: string | null }> = [
  {
    id: 'DASHBOARD',
    label: 'Smog & Inversion',
    icon: Activity,
    badge: null,
  },
  {
    id: 'COPILOT',
    label: 'AeroPulse Copilot',
    icon: Bot,
    badge: 'AI',
  },
  {
    id: 'ROUTINES',
    label: 'Low-Emission Routines',
    icon: CalendarClock,
    badge: null,
  },
  {
    id: 'IAQ_LAB',
    label: 'IAQ Hacks & DIY Lab',
    icon: Wrench,
    badge: 'CADR Calc',
  },
  {
    id: 'IMPACT',
    label: 'Direct Impact',
    icon: TrendingUp,
    badge: 'Berkeley Met.',
  },
  {
    id: 'COMMUNITY',
    label: 'Community Hub',
    icon: Users,
    badge: 'Action',
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activeRoutinesCount,
}) => {
  const tabIds = TABS.map(t => t.id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleTabKeyNavigation(e, tabIds, activeTab, (tabId) => onTabChange(tabId as TabId));
  };

  return (
    <nav 
      aria-label="Main Application Navigation" 
      className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar focus:outline-none" 
          role="tablist"
          aria-label="AeroPulse Main Features"
          onKeyDown={handleKeyDown}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const dynamicBadge = tab.id === 'ROUTINES' && activeRoutinesCount > 0 
              ? `${activeRoutinesCount} Active` 
              : tab.badge;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 relative focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} aria-hidden="true" />
                <span>{tab.label}</span>
                {dynamicBadge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {dynamicBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
