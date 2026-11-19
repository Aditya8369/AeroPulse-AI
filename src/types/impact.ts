export interface ImpactMetrics {
  totalPM25AvoidedMicrograms: number;
  cigarettesEquivalenceSaved: number; // based on Berkeley Earth: ~22 µg/m³ PM2.5 in 24h = 1 cigarette
  co2EmissionsSavedKg: number;
  indoorAQIImprovementPercent: number;
  activeActionsCount: number;
  healthRiskReductionSummary: string;
}

export interface CommunityReport {
  id: string;
  type: 'Open Biomass/Stubble Burning' | 'Construction Dust Plume' | 'Garbage Incineration' | 'Industrial Smoke' | 'Idling Heavy Vehicles';
  locationDescription: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  status: 'Verified' | 'Investigating' | 'Reported to Municipality';
  upvotes: number;
  notes: string;
}

export interface CommunityPledge {
  id: string;
  title: string;
  description: string;
  supportersCount: number;
  estimatedCommunityPM25ReductionKgPerWeek: number;
  category: 'Clean Transit' | 'No Open Fires' | 'Green School Run' | 'Shared DIY Purifiers';
}
