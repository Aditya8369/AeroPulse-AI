import { CorsiRosenthalParams, CorsiRosenthalResult } from '../types/iaq';
import { ImpactMetrics } from '../types/impact';
import { ScheduledActivity } from '../types/routine';

/**
 * Berkeley Earth Cigarette Equivalence Model:
 * 1 cigarette = approx 22 µg/m³ PM2.5 exposure over 24 hours.
 */
export function calculateCigaretteEquivalence(pm25ExposureUgm3: number): number {
  if (pm25ExposureUgm3 <= 0) return 0;
  const cigarettes = pm25ExposureUgm3 / 22;
  return Number(cigarettes.toFixed(1));
}

/**
 * Calculate microgram PM2.5 inhaled during an exposure period:
 * Inhaled PM2.5 (µg) = Breathing rate (m³/hr) * Time (hr) * PM2.5 (µg/m³)
 */
export function calculateInhaledDose(
  pm25ConcentrationUgm3: number, 
  durationHours: number, 
  intensity: 'rest' | 'light' | 'moderate' | 'heavy' = 'light'
): number {
  const ventilationRates: Record<string, number> = {
    rest: 0.5,      // sleeping / sitting
    light: 0.8,     // cooking / light walking / desk work
    moderate: 1.5,  // brisk walking / active commuting
    heavy: 3.2      // outdoor running / cycling / HIIT
  };

  const rate = ventilationRates[intensity] || 0.8;
  const inhaledUgm3 = rate * durationHours * pm25ConcentrationUgm3;
  return Math.round(inhaledUgm3);
}

/**
 * Calculate Corsi-Rosenthal Box CADR, ACH, and cost performance
 */
export function calculateCorsiRosenthalBox(params: CorsiRosenthalParams): CorsiRosenthalResult {
  const { roomLengthFeet, roomWidthFeet, roomHeightFeet, targetACH, filterCount, mervRating } = params;
  
  const roomVolumeCubicFeet = Math.max(1, roomLengthFeet * roomWidthFeet * roomHeightFeet);
  
  // Required CADR in CFM = (Volume in cu ft * Target ACH) / 60 mins
  const requiredCADR_CFM = Math.round((roomVolumeCubicFeet * targetACH) / 60);

  // Empirical test data from UC Davis / EPA for standard 20" Box Fan with cardboard shroud:
  // Base 4-filter cube MERV 13 with shroud: ~480 CFM
  // 5-filter compactor MERV 13 with shroud: ~530 CFM
  // MERV 14 has slightly higher static drop (-5% flow, +4% single-pass efficiency):
  let baseCADR = filterCount === 5 ? 530 : 480;
  if (mervRating === 14) baseCADR *= 0.95;

  const estimatedActualCADR_CFM = Math.round(baseCADR);
  const achAchieved = Number(((estimatedActualCADR_CFM * 60) / roomVolumeCubicFeet).toFixed(1));
  
  // Cost breakdown
  // 20" Box fan: ~$22-$25
  // MERV 13 filters: ~$9-$12 each
  // Duct tape + shroud cardboard: ~$6
  const fanCost = 25;
  const filterCost = filterCount * 11;
  const tapeCost = 6;
  const estimatedBuildCostUSD = fanCost + filterCost + tapeCost;

  // Commercial HEPA unit with comparable 480-500 CFM CADR (e.g. IQAir or Blueair 600 series)
  const commercialHepaEquivalentCostUSD = 450;

  const stepByStepGuide = [
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
    noiseLevelDba: 51, // Medium fan speed
    filterLifespanMonths: 6,
    isSufficient: estimatedActualCADR_CFM >= requiredCADR_CFM,
    stepByStepGuide
  };
}

/**
 * Aggregate daily impact metrics from adopted routine choices
 */
export function calculateTotalImpact(
  activities: ScheduledActivity[],
  outdoorPM25: number
): ImpactMetrics {
  const adopted = activities.filter(a => a.isAdopted);
  
  let totalPM25Avoided = 0;
  let totalCO2Grams = 0;

  adopted.forEach(act => {
    // Estimate baseline inhaled dose for the 1.5 hr slot
    const baseInhaled = calculateInhaledDose(outdoorPM25, 1.5, 'moderate');
    const avoidedInhaled = baseInhaled * (act.exposureReductionPercentage / 100);
    totalPM25Avoided += avoidedInhaled;
    totalCO2Grams += act.emissionReductionGramsCO2;
  });

  const totalPM25AvoidedMicrograms = Math.round(totalPM25Avoided);
  const co2EmissionsSavedKg = Number((totalCO2Grams / 1000).toFixed(2));
  
  // Calculate equivalent cigarettes saved
  // If outdoor exposure was reduced by X µg/m³ effective 24h concentration
  const dailyConcentrationReduction = totalPM25Avoided / 15; // Normalized to 15 m³ daily air intake
  const cigarettesEquivalenceSaved = calculateCigaretteEquivalence(dailyConcentrationReduction);

  const indoorAQIImprovementPercent = Math.min(85, Math.round((adopted.length / activities.length) * 80));

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
