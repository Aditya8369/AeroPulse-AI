import { describe, it, expect } from 'vitest';
import {
  calculateCigaretteEquivalence,
  calculateInhaledDose,
  calculateCorsiRosenthalBox,
  calculateTotalImpact
} from '../services/impactCalculator';
import { ScheduledActivity } from '../types/routine';

describe('impactCalculator tests', () => {
  it('correctly converts PM2.5 to Berkeley Earth cigarette equivalents', () => {
    // 22 µg/m³ = ~1 cigarette
    expect(calculateCigaretteEquivalence(22)).toBe(1.0);
    // 220 µg/m³ = 10.0 cigarettes
    expect(calculateCigaretteEquivalence(220)).toBe(10.0);
    // 0 or negative = 0
    expect(calculateCigaretteEquivalence(0)).toBe(0);
    expect(calculateCigaretteEquivalence(-10)).toBe(0);
  });

  it('calculates inhaled dose with different breathing intensity levels', () => {
    // Inhaled dose = rate * time * concentration
    // Rest rate = 0.5, 2 hours, 100 µg/m³ = 100
    const restDose = calculateInhaledDose(100, 2, 'rest');
    expect(restDose).toBe(100);

    // Heavy exercise rate = 3.2, 1 hour, 100 µg/m³ = 320
    const heavyDose = calculateInhaledDose(100, 1, 'heavy');
    expect(heavyDose).toBe(320);
  });

  it('properly evaluates Corsi-Rosenthal Box specifications and CADR', () => {
    const params = {
      roomLengthFeet: 15,
      roomWidthFeet: 12,
      roomHeightFeet: 9,
      targetACH: 5,
      fanDiameterInches: 20 as const,
      filterCount: 4 as const,
      mervRating: 13 as const
    };

    const result = calculateCorsiRosenthalBox(params);
    // Room volume = 15 * 12 * 9 = 1620 cu ft
    expect(result.roomVolumeCubicFeet).toBe(1620);
    // Required CADR = (1620 * 5) / 60 = 135 CFM
    expect(result.requiredCADR_CFM).toBe(135);
    // Actual CADR of 4-filter MERV 13 is 480 CFM
    expect(result.estimatedActualCADR_CFM).toBe(480);
    // Achieved ACH = (480 * 60) / 1620 = ~17.8 ACH
    expect(result.achAchieved).toBeGreaterThan(15);
    expect(result.isSufficient).toBe(true);
    expect(result.estimatedBuildCostUSD).toBeLessThan(100);
    expect(result.commercialHepaEquivalentCostUSD).toBeGreaterThan(300);
  });

  it('aggregates daily impact for adopted routines', () => {
    const mockActivities: ScheduledActivity[] = [
      {
        id: '1',
        timeSlot: '07:00 - 08:00',
        activityName: 'Morning Run Shifted Indoors',
        defaultHabit: 'Outdoor run',
        recommendedAlternative: 'Indoor run with CR Box',
        exposureReductionPercentage: 80,
        emissionReductionGramsCO2: 0,
        reason: 'Avoid inversion peak',
        isAdopted: true
      },
      {
        id: '2',
        timeSlot: '08:30 - 09:30',
        activityName: 'Metro Commute',
        defaultHabit: 'Solo Car',
        recommendedAlternative: 'Electric Metro',
        exposureReductionPercentage: 70,
        emissionReductionGramsCO2: 1800,
        reason: 'Tailpipe avoidance',
        isAdopted: true
      },
      {
        id: '3',
        timeSlot: '19:00 - 20:00',
        activityName: 'Evening Frying',
        defaultHabit: 'Unvented frying',
        recommendedAlternative: 'Covered boiling',
        exposureReductionPercentage: 50,
        emissionReductionGramsCO2: 200,
        reason: 'Indoor VOCs',
        isAdopted: false // Not adopted
      }
    ];

    const outdoorPM25 = 200;
    const impact = calculateTotalImpact(mockActivities, outdoorPM25);

    expect(impact.activeActionsCount).toBe(2);
    expect(impact.co2EmissionsSavedKg).toBe(1.8);
    expect(impact.totalPM25AvoidedMicrograms).toBeGreaterThan(0);
    expect(impact.cigarettesEquivalenceSaved).toBeGreaterThan(0);
    expect(impact.indoorAQIImprovementPercent).toBeGreaterThan(0);
  });
});
