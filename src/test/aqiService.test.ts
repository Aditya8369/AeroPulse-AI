import { describe, it, expect } from 'vitest';
import { getAQICategory, getCityAirData, calculateInversionLiftTime } from '../services/aqiService';

describe('aqiService tests', () => {
  it('correctly maps AQI values to EPA health categories', () => {
    expect(getAQICategory(35)).toBe('Good');
    expect(getAQICategory(75)).toBe('Moderate');
    expect(getAQICategory(125)).toBe('Unhealthy for Sensitive Groups');
    expect(getAQICategory(175)).toBe('Unhealthy');
    expect(getAQICategory(250)).toBe('Very Unhealthy');
    expect(getAQICategory(350)).toBe('Hazardous');
    expect(getAQICategory(450)).toBe('Severe+');
  });

  it('retrieves city air data with complete diurnal forecasts', () => {
    const data = getCityAirData('delhi-ncr');
    expect(data.cityName).toBe('Delhi NCR');
    expect(data.currentAQI).toBeGreaterThan(300);
    expect(data.hourlyForecast.length).toBeGreaterThan(0);
    expect(data.inversionLayerActive).toBe(true);
  });

  it('identifies safe ventilation hours during solar thermal lift', () => {
    const data = getCityAirData('delhi-ncr');
    const lift = calculateInversionLiftTime(data.hourlyForecast);
    expect(lift.safestHour).toBeDefined();
    expect(lift.minPM25).toBeLessThan(data.pollutants.pm25);
  });
});
