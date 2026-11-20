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
    // 0, negative, NaN or Infinity = 0
    expect(calculateCigaretteEquivalence(0)).toBe(0);
    expect(calculateCigaretteEquivalence(-10)).toBe(0);
    expect(calculateCigaretteEquivalence(NaN)).toBe(0);
    expect(calculateCigaretteEquivalence(Infinity)).toBe(0);
  });

  it('calculates inhaled dose with different breathing intensity levels', () => {
    // Inhaled dose = rate * time * concentration
    // Rest rate = 0.5, 2 hours, 100 µg/m³ = 100
    const restDose = calculateInhaledDose(100, 2, 'rest');
    expect(restDose).toBe(100);

    // Light rate = 0.8, 1 hour, 100 µg/m³ = 80
    const lightDose = calculateInhaledDose(100, 1, 'light');
    expect(lightDose).toBe(80);

    // Moderate rate = 1.5, 2 hours, 50 µg/m³ = 150
    const moderateDose = calculateInhaledDose(50, 2, 'moderate');
    expect(moderateDose).toBe(150);

    // Heavy exercise rate = 3.2, 1 hour, 100 µg/m³ = 320
    const heavyDose = calculateInhaledDose(100, 1, 'heavy');
    expect(heavyDose).toBe(320);

    // Invalid parameters guard
    expect(calculateInhaledDose(-50, 2, 'light')).toBe(0);
    expect(calculateInhaledDose(100, -1, 'light')).toBe(0);
  });

  it('evaluates standard 4-filter MERV 13 Corsi-Rosenthal Box specifications', () => {
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
    expect(result.achAchieved).toBeGreaterThan(15);
    expect(result.isSufficient).toBe(true);
    expect(result.estimatedBuildCostUSD).toBeLessThan(100);
    expect(result.commercialHepaEquivalentCostUSD).toBeGreaterThan(300);
    expect(result.stepByStepGuide.length).toBe(6);
  });

  it('evaluates 5-filter compactor and MERV 14 static pressure penalty', () => {
    // 5-filter MERV 13 compactor gives ~530 CFM
    const result5Filter = calculateCorsiRosenthalBox({
      roomLengthFeet: 20,
      roomWidthFeet: 20,
      roomHeightFeet: 10,
      targetACH: 6,
      fanDiameterInches: 20,
      filterCount: 5,
      mervRating: 13
    });
    expect(result5Filter.estimatedActualCADR_CFM).toBe(530);

    // 4-filter MERV 14 has ~5% static resistance drop (480 * 0.95 = 456 CFM)
    const resultMerv14 = calculateCorsiRosenthalBox({
      roomLengthFeet: 20,
      roomWidthFeet: 20,
      roomHeightFeet: 10,
      targetACH: 6,
      fanDiameterInches: 20,
      filterCount: 4,
      mervRating: 14
    });
    expect(resultMerv14.estimatedActualCADR_CFM).toBe(456);
  });

  it('identifies undersized units when room volume is excessively large', () => {
    // Large hall: 50 * 50 * 15 = 37,500 cu ft; at 5 ACH, required CADR = 3,125 CFM
    const oversizedRoom = calculateCorsiRosenthalBox({
      roomLengthFeet: 50,
      roomWidthFeet: 50,
      roomHeightFeet: 15,
      targetACH: 5,
      fanDiameterInches: 20,
      filterCount: 4,
      mervRating: 13
    });

    expect(oversizedRoom.isSufficient).toBe(false);
    expect(oversizedRoom.requiredCADR_CFM).toBeGreaterThan(oversizedRoom.estimatedActualCADR_CFM);
  });

  it('aggregates daily impact for adopted routines and sets clinical risk reduction summaries', () => {
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
        timeSlot: '12:00 - 13:00',
        activityName: 'Lunch Walk Timing',
        defaultHabit: 'Walk near busy ring road',
        recommendedAlternative: 'Park walk during solar lift',
        exposureReductionPercentage: 60,
        emissionReductionGramsCO2: 100,
        reason: 'Solar thermal lift window',
        isAdopted: true
      },
      {
        id: '4',
        timeSlot: '19:00 - 20:00',
        activityName: 'Evening Frying',
        defaultHabit: 'Unvented frying',
        recommendedAlternative: 'Covered boiling',
        exposureReductionPercentage: 50,
        emissionReductionGramsCO2: 200,
        reason: 'Indoor VOCs',
        isAdopted: true
      }
    ];

    const outdoorPM25 = 200;
    const impact4Adopted = calculateTotalImpact(mockActivities, outdoorPM25);

    expect(impact4Adopted.activeActionsCount).toBe(4);
    expect(impact4Adopted.co2EmissionsSavedKg).toBe(2.1);
    expect(impact4Adopted.totalPM25AvoidedMicrograms).toBeGreaterThan(0);
    expect(impact4Adopted.cigarettesEquivalenceSaved).toBeGreaterThan(0);
    expect(impact4Adopted.healthRiskReductionSummary).toContain('Significant alveolar particulate defense');

    // Test 2 adopted
    const impact2Adopted = calculateTotalImpact(
      mockActivities.map((a, i) => ({ ...a, isAdopted: i < 2 })),
      outdoorPM25
    );
    expect(impact2Adopted.healthRiskReductionSummary).toContain('Moderate exposure shield');

    // Test 0 adopted
    const impact0Adopted = calculateTotalImpact(
      mockActivities.map(a => ({ ...a, isAdopted: false })),
      outdoorPM25
    );
    expect(impact0Adopted.healthRiskReductionSummary).toContain('Adopt more routines');
  });
});
