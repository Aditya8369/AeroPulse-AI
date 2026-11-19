import { ScheduledActivity } from '../types/routine';

export const BASE_ROUTINE_ACTIVITIES: ScheduledActivity[] = [
  {
    id: 'act-morning-exercise',
    timeSlot: '06:00 - 07:15',
    activityName: 'Morning Exercise & Fitness',
    defaultHabit: 'Outdoor jogging or park cycling at dawn',
    recommendedAlternative: 'Indoor HIIT, yoga, or treadmill with HEPA / CR-Box running on High. Reschedule outdoor runs to 1:00 PM if AQI < 150.',
    exposureReductionPercentage: 82,
    emissionReductionGramsCO2: 0,
    reason: 'Dawn is the peak of the winter ground-inversion layer. Cold trapped air contains 300% higher particulate concentration than afternoon air. Deep cardio breathing multiplies alveolar deposition 5x.',
    vulnerabilitySpecificTip: 'Asthmatic & cardiac individuals must never jog outdoors below 15°C when AQI exceeds 100.',
    isAdopted: true
  },
  {
    id: 'act-school-commute',
    timeSlot: '07:30 - 08:30',
    activityName: 'School Drop-off & Morning Commute',
    defaultHabit: 'Open two-wheeler / auto-rickshaw or idling gas car in bumper-to-bumper queue',
    recommendedAlternative: 'Consolidated neighborhood school carpool or electric school bus route. Child wears fitted N95/FFP2 mask; vehicle set to cabin air recirculation mode.',
    exposureReductionPercentage: 74,
    emissionReductionGramsCO2: 1450,
    reason: 'Tailpipe exhaust from idling vehicles in morning fog creates high concentrations of ultrafine PM and toxic benzene at child stroller / seating height (0.5m - 1.2m).',
    vulnerabilitySpecificTip: 'Children have higher respiratory rates (20-30 breaths/min vs 12-16 in adults) and developing lungs; fitted child N95s are critical.',
    isAdopted: true
  },
  {
    id: 'act-midday-ventilation',
    timeSlot: '12:30 - 13:15',
    activityName: 'Home Ventilation & Air Refresh',
    defaultHabit: 'Keeping windows closed all day or opening them haphazardly at 8 AM',
    recommendedAlternative: 'Controlled 15-minute cross-ventilation window right after solar noon when thermal boundary layer lifts. Then re-seal and crank purifiers.',
    exposureReductionPercentage: 45,
    emissionReductionGramsCO2: 0,
    reason: 'Purges accumulated indoor CO2 (>1,500 ppm causes cognitive fatigue) while outdoor PM2.5 is at its diurnal minimum.',
    vulnerabilitySpecificTip: 'Elderly residents should remain in a separate closed room while living room windows are briefly cross-ventilated.',
    isAdopted: false
  },
  {
    id: 'act-evening-commute',
    timeSlot: '17:30 - 18:45',
    activityName: 'Evening Return Commute',
    defaultHabit: 'Solo ICE vehicle driving during peak traffic jam',
    recommendedAlternative: 'Shift commute 45 minutes earlier/later or switch to electric metro rail. If driving, maintain cabin recirculation and keep windows sealed.',
    exposureReductionPercentage: 68,
    emissionReductionGramsCO2: 2100,
    reason: 'Evening rush hour coincides with sunset ground-cooling, trapping exhaust in a collapsing boundary layer.',
    vulnerabilitySpecificTip: 'Use station-to-office covered skywalks or carry an N95 mask for platform waiting times.',
    isAdopted: false
  },
  {
    id: 'act-dinner-cooking',
    timeSlot: '19:30 - 20:30',
    activityName: 'Evening Meal Preparation',
    defaultHabit: 'High-heat frying or tempering without lids or exhaust venting',
    recommendedAlternative: 'Pre-heat exhaust hood on high 2 mins prior. Shift to induction cooktop or closed instant-pot stewing. Keep kitchen door shut.',
    exposureReductionPercentage: 70,
    emissionReductionGramsCO2: 320,
    reason: 'Aerosolized cooking oils and unvented gas burner emissions generate indoor PM2.5 levels equal to smoking 4 cigarettes in an enclosed space.',
    vulnerabilitySpecificTip: 'Keep infants and asthmatic family members out of the kitchen during and 30 minutes after cooking.',
    isAdopted: true
  },
  {
    id: 'act-nighttime-sleep',
    timeSlot: '22:00 - 06:00',
    activityName: 'Overnight Sleep Sanctuary',
    defaultHabit: 'Purifier turned off to save electricity or room left drafty',
    recommendedAlternative: 'Seal bedroom door bottom with a damp rolled towel draft stopper. Run bedroom purifier / CR-Box on medium/sleep mode all night. Maintain 45% humidity.',
    exposureReductionPercentage: 88,
    emissionReductionGramsCO2: 0,
    reason: 'You spend 7-8 continuous hours breathing in this single room. Purifying this micro-environment cuts total 24-hour PM2.5 lung dose by nearly half.',
    vulnerabilitySpecificTip: 'Ensure purifier airflow does not blow cold air directly onto the sleeper\'s face to avoid airway constriction.',
    isAdopted: true
  }
];
