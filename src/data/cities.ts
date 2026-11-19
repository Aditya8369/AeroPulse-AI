import { CityAirData } from '../types/aqi';

export const CITIES_DATA: Record<string, CityAirData> = {
  'delhi-ncr': {
    cityId: 'delhi-ncr',
    cityName: 'Delhi NCR',
    country: 'India',
    currentAQI: 382,
    category: 'Hazardous',
    pollutants: {
      pm25: 324.5,
      pm10: 468.2,
      no2: 89.4,
      o3: 24.1,
      co: 3.2,
      so2: 18.7
    },
    temperatureC: 13,
    humidityPercent: 78,
    windSpeedKmh: 4.2,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 140, // Extremely low boundary layer trapping smoke
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: [
      { hour: 0, label: '12 AM', predictedPM25: 310, aqi: 360, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Keep purifiers running on sleep mode; keep windows latched.' },
      { hour: 3, label: '3 AM', predictedPM25: 345, aqi: 395, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Peak midnight inversion accumulation; zero outdoor ventilation.' },
      { hour: 6, label: '6 AM', predictedPM25: 385, aqi: 425, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'DO NOT jog or exercise outdoors. Inversion lid at maximum compression.' },
      { hour: 9, label: '9 AM', predictedPM25: 350, aqi: 400, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Heavy rush-hour emissions trapped. Wear N95/FFP2 for essential transit.' },
      { hour: 12, label: '12 PM', predictedPM25: 180, aqi: 230, inversionStrength: 'Low', isVentilationSafe: true, activityRecommendation: 'Solar heating begins breaking thermal inversion lid. Brief cross-ventilation window.' },
      { hour: 14, label: '2 PM', predictedPM25: 145, aqi: 195, inversionStrength: 'Lifted', isVentilationSafe: true, activityRecommendation: 'Safest window of the day for quick airing or errand runs with N95.' },
      { hour: 17, label: '5 PM', predictedPM25: 220, aqi: 270, inversionStrength: 'Moderate', isVentilationSafe: false, activityRecommendation: 'Sun sinks, surface cools rapidly. Re-seal all windows and crank purifiers.' },
      { hour: 20, label: '8 PM', predictedPM25: 330, aqi: 380, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Night cooling traps domestic cooking and evening vehicular exhaust.' },
      { hour: 22, label: '10 PM', predictedPM25: 360, aqi: 410, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Severe nocturnal inversion. Keep bedroom air sealed with damp draft stopper.' }
    ]
  },
  'lahore': {
    cityId: 'lahore',
    cityName: 'Lahore',
    country: 'Pakistan',
    currentAQI: 415,
    category: 'Severe+',
    pollutants: {
      pm25: 375.0,
      pm10: 512.0,
      no2: 94.0,
      o3: 21.0,
      co: 3.8,
      so2: 24.0
    },
    temperatureC: 12,
    humidityPercent: 82,
    windSpeedKmh: 3.5,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 120,
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: [
      { hour: 0, label: '12 AM', predictedPM25: 360, aqi: 405, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Critical smog layer; run DIY or commercial HEPA in sealed bedrooms.' },
      { hour: 6, label: '6 AM', predictedPM25: 430, aqi: 450, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Severe hazardous smog. Schools should enforce indoor assembly only.' },
      { hour: 12, label: '12 PM', predictedPM25: 220, aqi: 270, inversionStrength: 'Low', isVentilationSafe: true, activityRecommendation: 'Sunlight partially thins smog. Brief 15-min air exchange if indoor CO2 is high.' },
      { hour: 15, label: '3 PM', predictedPM25: 190, aqi: 240, inversionStrength: 'Lifted', isVentilationSafe: true, activityRecommendation: 'Best window for urgent errands. Always wear sealed N95/KF94 masks.' },
      { hour: 20, label: '8 PM', predictedPM25: 390, aqi: 430, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Inversion settles. High particulate density.' }
    ]
  },
  'beijing': {
    cityId: 'beijing',
    cityName: 'Beijing',
    country: 'China',
    currentAQI: 178,
    category: 'Unhealthy',
    pollutants: {
      pm25: 108.0,
      pm10: 165.0,
      no2: 45.0,
      o3: 35.0,
      co: 1.4,
      so2: 9.0
    },
    temperatureC: -2,
    humidityPercent: 42,
    windSpeedKmh: 12.0,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 320,
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: [
      { hour: 0, label: '12 AM', predictedPM25: 115, aqi: 182, inversionStrength: 'Moderate', isVentilationSafe: false, activityRecommendation: 'Central heating active; maintain indoor humidity at 45%.' },
      { hour: 6, label: '6 AM', predictedPM25: 135, aqi: 192, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Cold dawn calm; avoid morning jogging outdoors.' },
      { hour: 12, label: '12 PM', predictedPM25: 75, aqi: 160, inversionStrength: 'Low', isVentilationSafe: true, activityRecommendation: 'Northerly breezes easing ground smog; moderate ventilation permissible.' },
      { hour: 15, label: '3 PM', predictedPM25: 65, aqi: 152, inversionStrength: 'Lifted', isVentilationSafe: true, activityRecommendation: 'Good time for brisk walk or airing out rooms.' },
      { hour: 20, label: '8 PM', predictedPM25: 120, aqi: 184, inversionStrength: 'Moderate', isVentilationSafe: false, activityRecommendation: 'Close dampers and maintain indoor filtration.' }
    ]
  },
  'salt-lake-city': {
    cityId: 'salt-lake-city',
    cityName: 'Salt Lake City Basin',
    country: 'USA',
    currentAQI: 158,
    category: 'Unhealthy',
    pollutants: {
      pm25: 68.4,
      pm10: 92.0,
      no2: 38.0,
      o3: 28.0,
      co: 0.9,
      so2: 4.0
    },
    temperatureC: -4,
    humidityPercent: 65,
    windSpeedKmh: 5.0,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 220, // Classic Wasatch basin cold pool trapping particulate
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: [
      { hour: 0, label: '12 AM', predictedPM25: 65, aqi: 155, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Wasatch cold pool holding woodstove & vehicle exhaust in valley floor.' },
      { hour: 7, label: '7 AM', predictedPM25: 82, aqi: 165, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Peak morning commute stagnation. Consider UTA Trax light rail transit.' },
      { hour: 13, label: '1 PM', predictedPM25: 48, aqi: 132, inversionStrength: 'Moderate', isVentilationSafe: true, activityRecommendation: 'Sun elevation provides brief solar mixing; best time for outdoor tasks.' },
      { hour: 18, label: '6 PM', predictedPM25: 75, aqi: 161, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: 'Avoid burning wood in fireplaces (mandatory action day).' }
    ]
  },
  'london': {
    cityId: 'london',
    cityName: 'London',
    country: 'UK',
    currentAQI: 88,
    category: 'Moderate',
    pollutants: {
      pm25: 29.5,
      pm10: 42.0,
      no2: 48.0,
      o3: 22.0,
      co: 0.6,
      so2: 3.0
    },
    temperatureC: 6,
    humidityPercent: 86,
    windSpeedKmh: 14.0,
    inversionLayerActive: false,
    thermalInversionHeightMeters: 650,
    dominantPollutant: 'NO2',
    updatedAt: new Date().toISOString(),
    hourlyForecast: [
      { hour: 0, label: '12 AM', predictedPM25: 22, aqi: 72, inversionStrength: 'Low', isVentilationSafe: true, activityRecommendation: 'Clean marine airflow keeping pollution dispersed.' },
      { hour: 8, label: '8 AM', predictedPM25: 38, aqi: 106, inversionStrength: 'Moderate', isVentilationSafe: false, activityRecommendation: 'Morning traffic spike along arterial routes (A406 / Central London).' },
      { hour: 13, label: '1 PM', predictedPM25: 25, aqi: 78, inversionStrength: 'Lifted', isVentilationSafe: true, activityRecommendation: 'Safe window for outdoor walks and open window aeration.' },
      { hour: 19, label: '7 PM', predictedPM25: 32, aqi: 92, inversionStrength: 'Low', isVentilationSafe: true, activityRecommendation: 'Domestic gas boiler emissions rising; moderate sensitive precaution.' }
    ]
  },
  'los-angeles': {
    cityId: 'los-angeles',
    cityName: 'Los Angeles Basin',
    country: 'USA',
    currentAQI: 122,
    category: 'Unhealthy for Sensitive Groups',
    pollutants: {
      pm25: 44.2,
      pm10: 68.0,
      no2: 42.0,
      o3: 45.0,
      co: 1.1,
      so2: 2.0
    },
    temperatureC: 17,
    humidityPercent: 55,
    windSpeedKmh: 8.0,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 400,
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: [
      { hour: 0, label: '12 AM', predictedPM25: 35, aqi: 99, inversionStrength: 'Moderate', isVentilationSafe: true, activityRecommendation: 'Offshore breeze helping overnight clearing.' },
      { hour: 7, label: '7 AM', predictedPM25: 52, aqi: 142, inversionStrength: 'High', isVentilationSafe: false, activityRecommendation: '405/10 freeway basin buildup. Sensitive groups should avoid highway runs.' },
      { hour: 13, label: '1 PM', predictedPM25: 38, aqi: 107, inversionStrength: 'Low', isVentilationSafe: true, activityRecommendation: 'Sea breeze ventilation active; safe for midday outdoor play.' },
      { hour: 18, label: '6 PM', predictedPM25: 48, aqi: 131, inversionStrength: 'Moderate', isVentilationSafe: false, activityRecommendation: 'Evening commuter slowdown; keep car ventilation on recirculate.' }
    ]
  }
};
