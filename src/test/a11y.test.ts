import { describe, it, expect, vi } from 'vitest';
import {
  getAQIColorBlindSafeClass,
  announceToScreenReader,
  handleTabKeyNavigation
} from '../utils/a11y';

describe('a11y utility tests', () => {
  it('maps all AQI bands to compliant WCAG colorblind-safe classes', () => {
    // 0-50 Good
    const good = getAQIColorBlindSafeClass(30);
    expect(good.label).toContain('Good');
    expect(good.badgeBg).toContain('emerald');

    // 51-100 Moderate
    const moderate = getAQIColorBlindSafeClass(80);
    expect(moderate.label).toContain('Moderate');
    expect(moderate.badgeBg).toContain('amber');

    // 101-150 Sensitive
    const sensitive = getAQIColorBlindSafeClass(130);
    expect(sensitive.label).toContain('Unhealthy for Sensitive Groups');
    expect(sensitive.badgeBg).toContain('orange');

    // 151-200 Unhealthy
    const unhealthy = getAQIColorBlindSafeClass(180);
    expect(unhealthy.label).toContain('Unhealthy (151-200)');
    expect(unhealthy.badgeBg).toContain('rose');

    // 201-300 Very Unhealthy
    const veryUnhealthy = getAQIColorBlindSafeClass(250);
    expect(veryUnhealthy.label).toContain('Very Unhealthy');
    expect(veryUnhealthy.badgeBg).toContain('purple');

    // 300+ Hazardous
    const hazardous = getAQIColorBlindSafeClass(420);
    expect(hazardous.label).toContain('Hazardous');
    expect(hazardous.badgeBg).toContain('red-950');
  });

  it('creates screen reader live region and announces updates', async () => {
    announceToScreenReader('Switched to Copilot tab', 'assertive');
    
    // Announcer element should exist in DOM
    const el = document.getElementById('a11y-live-announcer');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('aria-live')).toBe('assertive');

    await new Promise(resolve => setTimeout(resolve, 70));
    expect(el?.textContent).toBe('Switched to Copilot tab');
  });

  it('handles tab key navigation: ArrowRight, ArrowLeft, Home, End', () => {
    const tabs = ['DASHBOARD', 'COPILOT', 'ROUTINES', 'IAQ_LAB'];
    let selected = 'DASHBOARD';
    const onSelect = (tab: string) => { selected = tab; };

    // ArrowRight moves forward
    handleTabKeyNavigation(
      { key: 'ArrowRight', preventDefault: vi.fn() } as unknown as React.KeyboardEvent,
      tabs,
      'DASHBOARD',
      onSelect
    );
    expect(selected).toBe('COPILOT');

    // ArrowLeft wraps around
    handleTabKeyNavigation(
      { key: 'ArrowLeft', preventDefault: vi.fn() } as unknown as React.KeyboardEvent,
      tabs,
      'DASHBOARD',
      onSelect
    );
    expect(selected).toBe('IAQ_LAB');

    // End goes to last tab
    handleTabKeyNavigation(
      { key: 'End', preventDefault: vi.fn() } as unknown as React.KeyboardEvent,
      tabs,
      'DASHBOARD',
      onSelect
    );
    expect(selected).toBe('IAQ_LAB');

    // Home goes to first tab
    handleTabKeyNavigation(
      { key: 'Home', preventDefault: vi.fn() } as unknown as React.KeyboardEvent,
      tabs,
      'IAQ_LAB',
      onSelect
    );
    expect(selected).toBe('DASHBOARD');
  });
});
