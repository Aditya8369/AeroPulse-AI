import { CorsiRosenthalParams, CorsiRosenthalResult } from '../types/iaq';
import { ImpactMetrics } from '../types/impact';
import { ScheduledActivity } from '../types/routine';
import {
  BERKELEY_EARTH_PM25_PER_CIGARETTE,
  AVERAGE_DAILY_RESPIRATION_VOLUME_M3,
  DEFAULT_ROUTINE_DURATION_HOURS,
  VENTILATION_RATES_M3_PER_HOUR,
  RespirationIntensity,
  CORSI_ROSENTHAL_BASE_CADR_CFM,
  MERV_14_CADR_MULTIPLIER,
  CR_BOX_COST_BENCHMARKS,
} from '../constants/scienceConstants';

/**
 * Berkeley Earth Cigarette Equivalence Model:
 * 1 cigarette ≈ 22 µg/m³ PM2.5 exposure over 24 hours.
 *
 * @param pm25ExposureUgm3 Effective 24-hour PM2.5 concentration in µg/m³
 * @returns Number of cigarettes equivalent to 1 decimal place
 */
export function calculateCigaretteEquivalence(pm25ExposureUgm3: number): number {
  if (!Number.isFinite(pm25ExposureUgm3) || pm25ExposureUgm3 <= 0) return 0;
  const cigarettes = pm25ExposureUgm3 / BERKELEY_EARTH_PM25_PER_CIGARETTE;
  return Number(cigarettes.toFixed(1));
}

/**
 * Calculates microgram PM2.5 inhaled during an exposure period:
 * Inhaled PM2.5 (µg) = Respiration Rate (m³/hr) × Duration (hr) × Ambient PM2.5 (µg/m³)
 *
 * @param pm25ConcentrationUgm3 Ambient particulate concentration in µg/m³
 * @param durationHours Duration of activity in hours
 * @param intensity Physical intensity level determining respiration volume
 * @returns Total inhaled microgram dose (rounded integer)
 */
export function calculateInhaledDose(
  pm25ConcentrationUgm3: number, 
  durationHours: number, 
  intensity: RespirationIntensity = 'light'
): number {
  if (!Number.isFinite(pm25ConcentrationUgm3) || pm25ConcentrationUgm3 <= 0) return 0;
  if (!Number.isFinite(durationHours) || durationHours <= 0) return 0;

  const rate = VENTILATION_RATES_M3_PER_HOUR[intensity] ?? VENTILATION_RATES_M3_PER_HOUR.light;
  const inhaledUgm3 = rate * durationHours * pm25ConcentrationUgm3;
  return Math.round(inhaledUgm3);
}

/**
 * Calculates Corsi-Rosenthal Box CADR, ACH, and cost performance
 *
 * @param params Room dimensions, filter count, and filter rating
 * @returns Complete engineering specifications and assembly checklist
 */
export function calculateCorsiRosenthalBox(params: CorsiRosenthalParams): CorsiRosenthalResult {
  const { roomLengthFeet, roomWidthFeet, roomHeightFeet, targetACH, filterCount, mervRating } = params;
  
  const cleanLength = Math.max(1, roomLengthFeet);
  const cleanWidth = Math.max(1, roomWidthFeet);
  const cleanHeight = Math.max(1, roomHeightFeet);
  const roomVolumeCubicFeet = cleanLength * cleanWidth * cleanHeight;
  
  // Required CADR (CFM) = (Room Volume in cu ft × Target ACH) / 60 minutes
  const requiredCADR_CFM = Math.round((roomVolumeCubicFeet * Math.max(1, targetACH)) / 60);

  // Empirical test data from UC Davis / EPA for standard 20" Box Fan with cardboard shroud:
  let baseCADR: number = filterCount === 5 
    ? CORSI_ROSENTHAL_BASE_CADR_CFM[5] 
    : CORSI_ROSENTHAL_BASE_CADR_CFM[4];

  if (mervRating === 14) {
    baseCADR *= MERV_14_CADR_MULTIPLIER;
  }

  const estimatedActualCADR_CFM = Math.round(baseCADR);
  const achAchieved = Number(((estimatedActualCADR_CFM * 60) / roomVolumeCubicFeet).toFixed(1));
  
  // Cost breakdown
  const fanCost = CR_BOX_COST_BENCHMARKS.boxFanUSD;
  const filterCost = filterCount * CR_BOX_COST_BENCHMARKS.filterUnitUSD;
  const tapeCost = CR_BOX_COST_BENCHMARKS.ductTapeAndShroudUSD;
  const estimatedBuildCostUSD = fanCost + filterCost + tapeCost;
  const commercialHepaEquivalentCostUSD = CR_BOX_COST_BENCHMARKS.commercialHepaEquivalentUSD;

  const stepByStepGuide: string[] = [
    `Cut bottom base: Cut a 20"x20" cardboard square from the box fan packaging for the bottom.`,
    `Arrange ${filterCount} MERV ${mervRating} filters with airflow arrows pointing inward toward the center chamber.`,
    `Duct-tape all corner seams with 2-inch heavy-duty tape to create an airtight seal.`,
    `Tape the cardboard bottom plate securely to prevent unsealed floor drafts.`,
    `Place the 20" box fan on top, blowing UPWARD into the room. Tape all four top seams.`,
    `Crucial: Cut a circular shroud with a 15-inch diameter hole and tape it over the front grille of the box fan. This stops edge-vortex backdraft and increases CADR by 25%.`
  ];

  return {
    roomVolumeCubicFeet,
    requiredCADR_CFM,
    estimatedActualCADR_CFM,
    achAchieved,
    estimatedBuildCostUSD,
    commercialHepaEquivalentCostUSD,
    noiseLevelDba: 51, // Medium fan speed standard
    filterLifespanMonths: 6,
    isSufficient: estimatedActualCADR_CFM >= requiredCADR_CFM,
    stepByStepGuide
  };
}

/**
 * Aggregates daily impact metrics from adopted routine choices
 *
 * @param activities List of scheduled daily activities with adoption flags
 * @param outdoorPM25 Current ambient outdoor PM2.5 in µg/m³
 * @returns Aggregated personal and community impact metrics
 */
export function calculateTotalImpact(
  activities: ScheduledActivity[],
  outdoorPM25: number
): ImpactMetrics {
  const adopted = activities.filter(a => a.isAdopted);
  
  let totalPM25Avoided = 0;
  let totalCO2Grams = 0;

  adopted.forEach(act => {
    // Estimate baseline inhaled dose for the standard exposure slot
    const baseInhaled = calculateInhaledDose(outdoorPM25, DEFAULT_ROUTINE_DURATION_HOURS, 'moderate');
    const avoidedInhaled = baseInhaled * (act.exposureReductionPercentage / 100);
    totalPM25Avoided += avoidedInhaled;
    totalCO2Grams += act.emissionReductionGramsCO2;
  });

  const totalPM25AvoidedMicrograms = Math.round(totalPM25Avoided);
  const co2EmissionsSavedKg = Number((totalCO2Grams / 1000).toFixed(2));
  
  // Calculate equivalent cigarettes saved normalized to daily respiration intake
  const dailyConcentrationReduction = totalPM25Avoided / AVERAGE_DAILY_RESPIRATION_VOLUME_M3;
  const cigarettesEquivalenceSaved = calculateCigaretteEquivalence(dailyConcentrationReduction);

  const indoorAQIImprovementPercent = activities.length > 0 
    ? Math.min(85, Math.round((adopted.length / activities.length) * 80))
    : 0;

  let healthRiskReductionSummary = 'Adopt more routines to unlock preventive health benefits.';
  if (adopted.length >= 4) {
    healthRiskReductionSummary = 'Significant alveolar particulate defense. Reduced risk of acute bronchospasm and night coughing.';
  } else if (adopted.length >= 2) {
    healthRiskReductionSummary = 'Moderate exposure shield. Commute and sleep protection active.';
  }

  return {
    totalPM25AvoidedMicrograms,
    cigarettesEquivalenceSaved,
    co2EmissionsSavedKg,
    indoorAQIImprovementPercent,
    activeActionsCount: adopted.length,
    healthRiskReductionSummary
  };
}
