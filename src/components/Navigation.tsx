import React from 'react';
import { 
  Activity, 
  Bot, 
  CalendarClock, 
  Wrench, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export type TabId = 'DASHBOARD' | 'COPILOT' | 'ROUTINES' | 'IAQ_LAB' | 'IMPACT' | 'COMMUNITY';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  activeRoutinesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activeRoutinesCount,
}) => {
  const tabs = [
    {
      id: 'DASHBOARD' as TabId,
      label: 'Smog & Inversion',
      icon: Activity,
      badge: null,
    },
    {
      id: 'COPILOT' as TabId,
      label: 'AeroPulse Copilot',
      icon: Bot,
      badge: 'AI',
    },
    {
      id: 'ROUTINES' as TabId,
      label: 'Low-Emission Routines',
      icon: CalendarClock,
      badge: activeRoutinesCount > 0 ? `${activeRoutinesCount} Active` : null,
    },
    {
      id: 'IAQ_LAB' as TabId,
      label: 'IAQ Hacks & DIY Lab',
      icon: Wrench,
      badge: 'CADR Calc',
    },
    {
      id: 'IMPACT' as TabId,
      label: 'Direct Impact',
      icon: TrendingUp,
      badge: 'Berkeley Met.',
    },
    {
      id: 'COMMUNITY' as TabId,
      label: 'Community Hub',
      icon: Users,
      badge: 'Action',
    },
  ];

  return (
    <nav 
      aria-label="Main Application Navigation" 
      className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 relative ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} aria-hidden="true" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {tab.badge}
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
