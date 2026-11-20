export interface ImpactMetrics {
  totalPM25AvoidedMicrograms: number;
  cigarettesEquivalenceSaved: number; // based on Berkeley Earth: ~22 µg/m³ PM2.5 in 24h = 1 cigarette
  co2EmissionsSavedKg: number;
  indoorAQIImprovementPercent: number;
  activeActionsCount: number;
  healthRiskReductionSummary: string;
}

export type CommunityReportType = 
  | 'Open Biomass/Stubble Burning' 
  | 'Construction Dust Plume' 
  | 'Municipal Waste Incineration' 
  | 'Industrial Smoke' 
  | 'Idling Heavy Vehicles';

export type CommunityReportStatus = 
  | 'Verified' 
  | 'Investigating' 
  | 'Reported to Municipality';

export interface CommunityReport {
  id: string;
  type: CommunityReportType;
  locationDescription: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  status: CommunityReportStatus;
  upvotes: number;
  notes: string;
}

export type PledgeCategory = 
  | 'Clean Transit' 
  | 'No Open Fires' 
  | 'Green School Run' 
  | 'Shared DIY Purifiers';

export interface CommunityPledge {
  id: string;
  title: string;
  description: string;
  supportersCount: number;
  estimatedCommunityPM25ReductionKgPerWeek: number;
  category: PledgeCategory;
}
