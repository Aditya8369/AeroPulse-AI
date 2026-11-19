export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous' 
  | 'Severe+';

export interface PollutantValues {
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2: number;       // ppb or µg/m³
  o3: number;        // ppb
  co: number;        // ppm
  so2: number;       // ppb
}

export interface DiurnalHourlyPrediction {
  hour: number;          // 0-23
  label: string;         // e.g. "6 AM"
  predictedPM25: number; // estimated PM2.5 in µg/m³
  aqi: number;
  inversionStrength: 'High' | 'Moderate' | 'Low' | 'Lifted'; // Thermal inversion layer trapping
  isVentilationSafe: boolean;
  activityRecommendation: string;
}

export interface CityAirData {
  cityId: string;
  cityName: string;
  country: string;
  currentAQI: number;
  category: AQICategory;
  pollutants: PollutantValues;
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  inversionLayerActive: boolean;
  thermalInversionHeightMeters: number; // e.g. 150m in severe winter vs 1200m in summer
  hourlyForecast: DiurnalHourlyPrediction[];
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2';
  updatedAt: string;
}

export type VulnerabilityGroup = 
  | 'Infant & Toddler (0-4)'
  | 'School-Age Child (5-17)'
  | 'Elderly (65+)'
  | 'Asthma / COPD / Respiratory'
  | 'Cardiovascular Condition'
  | 'Pregnant'
  | 'Active Outdoor Commuter'
  | 'Pet Owner';

export interface UserFamilyProfile {
  cityId: string;
  customLocation?: string;
  householdMembers: VulnerabilityGroup[];
  housingType: 'Apartment' | 'Independent House' | 'High-Rise (Floor 6+)' | 'Ground Floor';
  heatingType: 'Electric Heat Pump' | 'Radiator/Central' | 'Gas Heater' | 'Biomass/Wood Stove' | 'None/Portable';
  cookingFuel: 'Induction/Electric' | 'Piped Natural Gas' | 'LPG Cylinder' | 'Biomass/Chulha';
  commuteMode: 'Electric Metro/Rail' | 'EV Car' | 'Bus/Public Transit' | 'Gas/Diesel Car' | 'Motorbike/Scooter' | 'Bicycle/Walking';
  hasAirPurifier: boolean;
  purifierCount: number;
}
