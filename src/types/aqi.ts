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

export type InversionStrength = 'High' | 'Moderate' | 'Low' | 'Lifted';

export interface DiurnalHourlyPrediction {
  hour: number;          // 0-23
  label: string;         // e.g. "6 AM"
  predictedPM25: number; // estimated PM2.5 in µg/m³
  aqi: number;
  inversionStrength: InversionStrength;
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
  thermalInversionHeightMeters: number; // e.g. 140m in severe winter vs 1200m in summer
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

export type HousingType = 
  | 'Apartment' 
  | 'Independent House' 
  | 'Basement' 
  | 'High-Rise (Floor 10+)';

export type HeatingType = 
  | 'Electric Heat Pump' 
  | 'Radiator (Hydronic)' 
  | 'Open Coil Space Heater' 
  | 'Gas / Kerosene Heater' 
  | 'Biomass / Wood Stove';

export type CookingFuel = 
  | 'Induction / Electric' 
  | 'Piped Natural Gas' 
  | 'LPG Cylinder' 
  | 'Solid Fuel / Coal';

export type CommuteMode = 
  | 'Metro / Train' 
  | 'Bus' 
  | 'Gas/Diesel Car' 
  | 'Two-Wheeler (Motorcycle/Scooter)' 
  | 'Bicycle / Walking' 
  | 'Work from Home';

export interface UserFamilyProfile {
  cityId: string;
  customLocation?: string;
  householdMembers: VulnerabilityGroup[];
  housingType: HousingType;
  heatingType: HeatingType;
  cookingFuel: CookingFuel;
  commuteMode: CommuteMode;
  hasAirPurifier: boolean;
  purifierCount: number;
}
