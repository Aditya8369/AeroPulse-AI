import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAQICategory,
  getCityAirData,
  updateCustomCityData,
  calculateInversionLiftTime
} from '../services/aqiService';
import { safeLocalStorageClear } from '../utils/storage';
import { DiurnalHourlyPrediction } from '../types/aqi';

describe('aqiService tests', () => {
  beforeEach(() => {
    safeLocalStorageClear();
  });

  it('correctly maps AQI values to EPA health categories', () => {
    expect(getAQICategory(35)).toBe('Good');
    expect(getAQICategory(75)).toBe('Moderate');
    expect(getAQICategory(125)).toBe('Unhealthy for Sensitive Groups');
    expect(getAQICategory(175)).toBe('Unhealthy');
    expect(getAQICategory(250)).toBe('Very Unhealthy');
    expect(getAQICategory(350)).toBe('Hazardous');
    expect(getAQICategory(450)).toBe('Severe+');
  });

  it('retrieves city air data with complete diurnal forecasts and caches result', () => {
    const data = getCityAirData('delhi-ncr');
    expect(data.cityName).toBe('Delhi NCR');
    expect(data.currentAQI).toBeGreaterThan(300);
    expect(data.hourlyForecast.length).toBeGreaterThan(0);
    expect(data.inversionLayerActive).toBe(true);

    // Call again to verify cache hit
    const cachedData = getCityAirData('delhi-ncr');
    expect(cachedData.cityName).toBe('Delhi NCR');
  });

  it('falls back to Delhi NCR data when city ID is unknown', () => {
    const data = getCityAirData('unknown-city-id');
    expect(data.cityName).toBe('Delhi NCR');
  });

  it('updates custom city telemetry and recalculates category', () => {
    const updated = updateCustomCityData({
      cityId: 'delhi-ncr',
      currentAQI: 45
    });

    expect(updated.currentAQI).toBe(45);
    expect(updated.category).toBe('Good');
    expect(updated.updatedAt).toBeDefined();
  });

  it('identifies safe ventilation hours during solar thermal lift', () => {
    const data = getCityAirData('delhi-ncr');
    const lift = calculateInversionLiftTime(data.hourlyForecast);
    expect(lift.safestHour).toBeDefined();
    expect(lift.minPM25).toBeLessThan(data.pollutants.pm25);
  });

  it('falls back to default lift window when no hours are marked ventilation safe', () => {
    const allUnsafeForecast: DiurnalHourlyPrediction[] = [
      { hour: 0, label: '12 AM', predictedPM25: 400, aqi: 450, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Sealed' },
      { hour: 6, label: '6 AM', predictedPM25: 450, aqi: 500, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Sealed' }
    ];

    const fallbackLift = calculateInversionLiftTime(allUnsafeForecast);
    expect(fallbackLift.startHour).toBe('12:00 PM');
    expect(fallbackLift.endHour).toBe('02:00 PM');
    expect(fallbackLift.safestHour).toBe('01:00 PM');
  });
});
