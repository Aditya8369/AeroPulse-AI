/**
 * Accessibility (a11y) utilities for WCAG 2.1 AA compliance
 */

export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return;

  let announcer = document.getElementById('a11y-live-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-live-announcer';
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
  } else {
    announcer.setAttribute('aria-live', politeness);
  }

  // Clear and update with microtask to ensure screen readers announce repeating updates
  announcer.textContent = '';
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 50);
}

export interface AQIColorClass {
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  label: string;
}

export function getAQIColorBlindSafeClass(aqi: number): AQIColorClass {
  if (aqi <= 50) {
    return {
      badgeBg: 'bg-emerald-600 dark:bg-emerald-700',
      badgeText: 'text-white',
      borderColor: 'border-emerald-500',
      label: 'Good (0-50)'
    };
  }
  if (aqi <= 100) {
    return {
      badgeBg: 'bg-amber-500 dark:bg-amber-600',
      badgeText: 'text-slate-950 font-bold',
      borderColor: 'border-amber-400',
      label: 'Moderate (51-100)'
    };
  }
  if (aqi <= 150) {
    return {
      badgeBg: 'bg-orange-600 dark:bg-orange-700',
      badgeText: 'text-white',
      borderColor: 'border-orange-500',
      label: 'Unhealthy for Sensitive Groups (101-150)'
    };
  }
  if (aqi <= 200) {
    return {
      badgeBg: 'bg-rose-600 dark:bg-rose-700',
      badgeText: 'text-white',
      borderColor: 'border-rose-500',
      label: 'Unhealthy (151-200)'
    };
  }
  if (aqi <= 300) {
    return {
      badgeBg: 'bg-purple-700 dark:bg-purple-800',
      badgeText: 'text-white',
      borderColor: 'border-purple-500',
      label: 'Very Unhealthy (201-300)'
    };
  }
  return {
    badgeBg: 'bg-red-950 dark:bg-red-900',
    badgeText: 'text-red-100 font-extrabold',
    borderColor: 'border-red-600',
    label: 'Hazardous / Severe+ (300+)'
  };
}

/**
 * Handles ArrowLeft / ArrowRight / Home / End keyboard navigation for WAI-ARIA tablists
 */
export function handleTabKeyNavigation(
  e: React.KeyboardEvent,
  tabs: string[],
  activeTab: string,
  onSelectTab: (tabId: string) => void
): void {
  const currentIndex = tabs.indexOf(activeTab);
  if (currentIndex === -1) return;

  let nextIndex: number | null = null;
  if (e.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (e.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (e.key === 'Home') {
    nextIndex = 0;
  } else if (e.key === 'End') {
    nextIndex = tabs.length - 1;
  }

  if (nextIndex !== null) {
    e.preventDefault();
    onSelectTab(tabs[nextIndex]);
    const tabEl = document.getElementById(`tab-${tabs[nextIndex]}`);
    if (tabEl) {
      tabEl.focus();
    }
  }
}
