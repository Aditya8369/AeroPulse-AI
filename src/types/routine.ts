export interface ScheduledActivity {
  id: string;
  timeSlot: string; // e.g. "06:30 - 07:30"
  activityName: string;
  defaultHabit: string;
  recommendedAlternative: string;
  exposureReductionPercentage: number;
  emissionReductionGramsCO2: number;
  reason: string;
  vulnerabilitySpecificTip?: string;
  isAdopted: boolean;
}

export interface DayPlan {
  date: string;
  riskLevel: 'Hazardous' | 'High Risk' | 'Moderate Risk' | 'Acceptable';
  inversionWarningTime: string;
  safeVentilationWindow: string;
  activities: ScheduledActivity[];
}
