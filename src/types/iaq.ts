export interface CorsiRosenthalParams {
  roomLengthFeet: number;
  roomWidthFeet: number;
  roomHeightFeet: number;
  targetACH: number; // typically 4 to 6 for effective PM2.5 & aerosol clearance
  fanDiameterInches: 20; // Standard 20" box fan
  filterCount: 4 | 5;    // 4-filter cube or 5-filter compactor style
  mervRating: 13 | 14;   // MERV 13 is the gold standard for PM2.5 & virus
}

export interface CorsiRosenthalResult {
  roomVolumeCubicFeet: number;
  requiredCADR_CFM: number;
  estimatedActualCADR_CFM: number;
  achAchieved: number;
  estimatedBuildCostUSD: number;
  commercialHepaEquivalentCostUSD: number;
  noiseLevelDba: number;
  filterLifespanMonths: number;
  isSufficient: boolean;
  stepByStepGuide: string[];
}

export interface IAQHack {
  id: string;
  title: string;
  category: 'DIY Filter' | 'Ventilation' | 'Cooking' | 'Humidity' | 'Plants' | 'Sealing';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  costLevel: 'Zero-Cost' | 'Low ($10-$30)' | 'Moderate ($30-$80)';
  effectivenessPercent: number; // e.g. 70% PM2.5 reduction
  summary: string;
  detailedSteps: string[];
  mythBuster?: string;
  scienceBacking: string;
  warningNote?: string;
}
