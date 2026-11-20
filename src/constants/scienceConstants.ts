/**
 * Scientific constants and peer-reviewed conversion factors used across AeroPulse AI
 */

/**
 * Berkeley Earth Cigarette Equivalence Factor:
 * 1 cigarette is equivalent to ~22 µg/m³ PM2.5 inhalation exposure over a 24-hour period.
 * Reference: Muller & Muller (Berkeley Earth, 2015).
 */
export const BERKELEY_EARTH_PM25_PER_CIGARETTE = 22;

/**
 * Average daily adult respiration volume in cubic meters.
 * Standard EPA exposure factors handbook value (~15-16 m³/day for adults).
 */
export const AVERAGE_DAILY_RESPIRATION_VOLUME_M3 = 15;

/**
 * Baseline hours assigned to routine activity exposure periods.
 */
export const DEFAULT_ROUTINE_DURATION_HOURS = 1.5;

/**
 * Ventilation breathing rates in m³/hour by intensity level.
 * Derived from EPA Exposure Factors Handbook (2011).
 */
export const VENTILATION_RATES_M3_PER_HOUR = {
  rest: 0.5,      // Sitting / sleep
  light: 0.8,     // Desk work / light household chores
  moderate: 1.5,  // Brisk walking / active transit
  heavy: 3.2,     // High-intensity running / cycling
} as const;

export type RespirationIntensity = keyof typeof VENTILATION_RATES_M3_PER_HOUR;

/**
 * Corsi-Rosenthal Box empirical CADR delivery by filter count (using standard 20" box fan + 15" circular shroud).
 * Tested by UC Davis Air Quality Research Center & EPA.
 */
export const CORSI_ROSENTHAL_BASE_CADR_CFM = {
  4: 480, // 4-filter cube configuration
  5: 530, // 5-filter compactor configuration
} as const;

/**
 * MERV 14 airflow reduction multiplier due to tighter media static pressure drop.
 */
export const MERV_14_CADR_MULTIPLIER = 0.95;

/**
 * DIY Corsi-Rosenthal unit cost benchmarks in USD.
 */
export const CR_BOX_COST_BENCHMARKS = {
  boxFanUSD: 25,
  filterUnitUSD: 11,
  ductTapeAndShroudUSD: 6,
  commercialHepaEquivalentUSD: 450,
} as const;

/**
 * WHO Global Air Quality Guidelines (2021) targets for particulate matter.
 */
export const WHO_AIR_QUALITY_TARGETS = {
  pm25AnnualLimitUgm3: 5,
  pm25DailyLimitUgm3: 15,
  pm10AnnualLimitUgm3: 15,
  pm10DailyLimitUgm3: 45,
  no2AnnualLimitUgm3: 10,
  no2DailyLimitUgm3: 25,
  recommendedACHMin: 4,
  recommendedACHMax: 6,
} as const;

/**
 * Diurnal solar thermal lift typical window fallback hours.
 */
export const DEFAULT_INVERSION_LIFT_WINDOW = {
  startHour: '12:00 PM',
  endHour: '02:00 PM',
  safestHour: '01:00 PM',
  fallbackMinPM25: 150,
} as const;
