import { CITIES_DATA } from '../data/cities';
import { AQICategory, CityAirData } from '../types/aqi';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';

const CACHE_KEY_PREFIX = 'aeropulse_aqi_';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  if (aqi <= 400) return 'Hazardous';
  return 'Severe+';
}

export function getCityAirData(cityId: string): CityAirData {
  const cached = safeLocalStorageGet<CityAirData | null>(`${CACHE_KEY_PREFIX}${cityId}`, null);
  if (cached) {
    return cached;
  }

  const fallback = CITIES_DATA[cityId] || CITIES_DATA['delhi-ncr'];
  safeLocalStorageSet(`${CACHE_KEY_PREFIX}${cityId}`, fallback, CACHE_TTL_MS);
  return fallback;
}

export function updateCustomCityData(custom: Partial<CityAirData> & { cityId: string }): CityAirData {
  const base = CITIES_DATA[custom.cityId] || CITIES_DATA['delhi-ncr'];
  const updated: CityAirData = {
    ...base,
    ...custom,
    category: getAQICategory(custom.currentAQI ?? base.currentAQI),
    updatedAt: new Date().toISOString()
  };

  safeLocalStorageSet(`${CACHE_KEY_PREFIX}${custom.cityId}`, updated, CACHE_TTL_MS);
  return updated;
}

export function calculateInversionLiftTime(forecast: CityAirData['hourlyForecast']): {
  startHour: string;
  endHour: string;
  safestHour: string;
  minPM25: number;
} {
  const safeWindows = forecast.filter(f => f.isVentilationSafe);
  if (safeWindows.length === 0) {
    return {
      startHour: '12:00 PM',
      endHour: '02:00 PM',
      safestHour: '01:00 PM',
      minPM25: 150
    };
  }

  const sorted = [...safeWindows].sort((a, b) => a.predictedPM25 - b.predictedPM25);
  const safest = sorted[0];

  return {
    startHour: safeWindows[0].label,
    endHour: safeWindows[safeWindows.length - 1].label,
    safestHour: safest.label,
    minPM25: safest.predictedPM25
  };
}
