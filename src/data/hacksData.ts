import { IAQHack } from '../types/iaq';

export const INDOOR_AIR_HACKS: IAQHack[] = [
  {
    id: 'corsi-rosenthal-box',
    title: 'The Corsi-Rosenthal Box (DIY High-CADR Air Cleaner)',
    category: 'DIY Filter',
    difficulty: 'Intermediate',
    costLevel: 'Moderate ($30-$80)',
    effectivenessPercent: 88,
    summary: 'A proven DIY air purifier designed by environmental engineer Dr. Richard Corsi and Jim Rosenthal. Outperforms commercial units costing 5x as much.',
    detailedSteps: [
      'Acquire one standard 20-inch box fan and four 20x20x2-inch (or 20x20x1-inch) MERV 13 furnace filters.',
      'Form the four filters into an open square cube with the airflow directional arrows all pointing INWARD toward the center.',
      'Duct-tape all four corner seams thoroughly to ensure airtight seals.',
      'Cut a piece of cardboard into a 20x20-inch bottom plate and duct-tape it tightly to the bottom of the filter cube.',
      'Place the 20-inch box fan on top, blowing UPWARD (exhausting clean air into the room).',
      'Crucial Step: Cut a circular cardboard shroud with an opening 14-15 inches in diameter and tape it to the front of the fan. This prevents air vortex backflow at the blade tips, boosting CADR by 20-30%!'
    ],
    mythBuster: 'Myth: "Cheap DIY filters don\'t capture tiny PM2.5 or viral aerosols." Fact: Peer-reviewed UC Davis and EPA testing proved the CR Box delivers 350-550 CFM of clean air, capturing 85-92% of sub-micron particles with 1/3 the filter resistance of single-filter designs.',
    scienceBacking: 'Peer-reviewed studies (e.g. Srikrishna 2021, UC Davis Air Quality Research Center) demonstrated CADR exceeding $600 commercial HEPA units due to the massive filter surface area (up to 80 sq. ft. of pleats) minimizing static pressure.',
    warningNote: 'Never use MERV 8 or standard fiberglass dust filters; only use MERV 13 or higher. Ensure the fan motor is certified (UL/CSA rated after 2012 with thermal safety fuses).'
  },
  {
    id: 'wet-mopping-vs-sweeping',
    title: 'Wet-Mopping & Microfiber vs. Dry Sweeping',
    category: 'Sealing',
    difficulty: 'Beginner',
    costLevel: 'Zero-Cost',
    effectivenessPercent: 65,
    summary: 'Dry sweeping and unsealed vacuuming resuspend heavy settled toxic particulate directly back into breathing zones for 4 to 8 hours.',
    detailedSteps: [
      'Immediately stop using traditional dry brooms, feather dusters, or non-HEPA vacuums during smog alerts.',
      'Use a damp microfiber flat mop with clean water and a drop of mild Castile soap to wipe hard floors.',
      'Wipe down tabletops, shelves, and window sills using damp microfiber cloths folded into quadrants.',
      'Rinse cloths frequently in a bucket rather than shaking them out.'
    ],
    mythBuster: 'Myth: "Sweeping every morning cleans the house of smog dust." Fact: Sweeping acts like an aerosol blower, resuspending PM2.5 and PM10 particles that had safely settled, tripling lung exposure for hours.',
    scienceBacking: 'Aerosol resuspension studies (Journal of Aerosol Science, 2018) show walking and sweeping on dry floors increases indoor PM10 by up to 400% and PM2.5 by 120% through mechanical lofting.',
    warningNote: 'Avoid excessive water on wood laminates; keep microfiber just damp, not soaking.'
  },
  {
    id: 'solar-thermal-ventilation-window',
    title: 'Precision Midday "Thermal-Lift" Ventilation',
    category: 'Ventilation',
    difficulty: 'Beginner',
    costLevel: 'Zero-Cost',
    effectivenessPercent: 55,
    summary: 'During winter, thermal inversion traps smog tightly against the ground until solar heating partially lifts the ceiling between 12 PM and 3 PM.',
    detailedSteps: [
      'Check the AeroPulse Diurnal Forecast to confirm the inversion layer has temporarily lifted.',
      'Between 12:00 PM and 2:30 PM, crack two opposite windows open by 2 to 3 inches to create a brief 10 to 15-minute cross-breeze.',
      'This rapidly purges accumulated metabolic indoor CO2, VOCs, and radon without allowing the heavy morning/evening smog pool to flood your home.',
      'Seal all windows completely before 4:30 PM as the sun lowers and the thermal boundary collapses back down to ground level.',
      'Immediately run purifiers on medium-high speed for 20 minutes following the air exchange.'
    ],
    mythBuster: 'Myth: "Keep all windows airtight 24/7 all winter long." Fact: Sealed spaces accumulate human CO2 above 1,800 ppm, causing brain fog, headaches, and respiratory inflammation that worsens smog vulnerability.',
    scienceBacking: 'Atmospheric boundary layer physics (Stull, 1988): Solar radiation heats the earth surface around solar noon, initiating convective mixing that dilutes ground-level PM2.5 into higher altitudes.'
  },
  {
    id: 'cooking-exhaust-and-simmer',
    title: 'Kitchen Fume Quarantine & Exhaust Timing',
    category: 'Cooking',
    difficulty: 'Beginner',
    costLevel: 'Zero-Cost',
    effectivenessPercent: 75,
    summary: 'Cooking with gas burners and high-heat frying produces PM2.5 levels exceeding 400 µg/m³ indoors, plus dangerous Nitrogen Dioxide (NO2).',
    detailedSteps: [
      'Turn on your kitchen range hood exhaust fan on HIGH 2 minutes BEFORE lighting the gas stove or cooktop to establish negative pressure.',
      'Keep the kitchen door closed to isolate cooking fumes from living rooms and sleeping quarters.',
      'Use lids on pots and frying pans to contain oil droplets and steam emissions.',
      'Favor boiling, simmering, steaming, or microwave/instant-pot cooking over high-temperature searing, deep-frying, or tadka/tempering.',
      'Leave the kitchen exhaust running for at least 8 to 10 minutes AFTER cooking ends.'
    ],
    mythBuster: 'Myth: "Smog only comes from cars and factories outside." Fact: A 15-minute stir-fry on an unvented gas burner can spike indoor PM2.5 to 600 µg/m³, worse than Delhi rush hour.',
    scienceBacking: 'Lawrence Berkeley National Laboratory (LBNL) indoor environmental health study: Gas stoves emit 50-400 ppb of NO2 and ultrafine PM, associated with a 42% increased risk of childhood asthma.'
  },
  {
    id: 'winter-mucosal-humidity-balance',
    title: 'Winter Respiratory Mucosa Protection (40-50% RH)',
    category: 'Humidity',
    difficulty: 'Intermediate',
    costLevel: 'Low ($10-$30)',
    effectivenessPercent: 60,
    summary: 'Winter heating dries indoor air below 25% relative humidity, desiccating respiratory cilia and mucus membranes, making lungs defenseless against PM2.5.',
    detailedSteps: [
      'Acquire an inexpensive digital thermo-hygrometer ($8-$12) to measure ambient indoor humidity.',
      'Aim for a target Relative Humidity (RH) between 40% and 50%.',
      'Use an evaporative humidifier or place shallow ceramic bowls of clean water near radiators/heaters.',
      'Never allow humidity to exceed 55%, as damp conditions trigger dust mites and mold sporulation.',
      'Drink warm fluids frequently to keep airway mucous layers hydrated and functioning as natural particle traps.'
    ],
    mythBuster: 'Myth: "Dry air is cleaner than humid air." Fact: Airway epithelial cilia require moisture to sweep inhaled soot and micro-particles out of bronchioles. Dry air paralyzes ciliary clearance.',
    scienceBacking: 'Annual Review of Virology (Lowen & Steel, 2014; Iwasaki et al., Yale 2019): Low ambient humidity impairs mucociliary clearance and innate immune defense against aerosolized particulate matter.'
  },
  {
    id: 'houseplants-science-truth',
    title: 'The Truth About Houseplants: Real vs. Mythical Air Cleaning',
    category: 'Plants',
    difficulty: 'Beginner',
    costLevel: 'Low ($10-$30)',
    effectivenessPercent: 5,
    summary: 'Understanding the true biological capability of plants vs. industrial particulate filtration to avoid a false sense of security.',
    detailedSteps: [
      'Enjoy houseplants (Snake Plants, Spider Plants, Peace Lilies) for biophilic mental wellness and slight daytime oxygenation.',
      'DO NOT rely on plants to filter winter smog, soot, smoke, or PM2.5. Plants do not have fans or porous electrostatic fiber matrices.',
      'To match the PM2.5 removal rate of ONE single budget HEPA purifier, you would need between 100 and 1,000 plants per square meter in your home!',
      'Ensure plant soil does not stay waterlogged, which breeds mold spores that aggravate winter bronchial sensitivity.'
    ],
    mythBuster: 'Myth: "NASA proved 3 snake plants purify your entire home of smog." Fact: The 1989 NASA study tested volatile organic chemicals in tiny, sealed 1-cubic-meter plexiglass containers with zero air exchange, not real homes battling PM2.5 particulate.',
    scienceBacking: 'Cummings & Waring (Journal of Exposure Science & Environmental Epidemiology, 2019): Natural ventilation and HVAC dilutes VOCs 100x to 1,000x faster than passive plant uptake; plants have virtually 0 CADR for PM2.5.'
  },
  {
    id: 'car-recirculation-commute-hack',
    title: 'Vehicle Cabin Air Recirculation Shield',
    category: 'Sealing',
    difficulty: 'Beginner',
    costLevel: 'Zero-Cost',
    effectivenessPercent: 85,
    summary: 'Commuting in bumper-to-bumper traffic can expose you to extreme micro-environments of diesel exhaust and toxic soot.',
    detailedSteps: [
      'Immediately upon starting your vehicle, press the "Air Recirculation" button (the car icon with the curved arrow inside).',
      'Inspect your car cabin air filter annually; replace standard paper filters with an activated carbon + HEPA cabin filter ($15-$25).',
      'Keep windows fully rolled up, especially when idling at toll plazas, traffic signals, and behind diesel freight trucks.',
      'If driving for more than 45 minutes with multiple passengers, switch briefly (for 60 seconds) to fresh air to vent CO2, then re-engage recirculation.'
    ],
    mythBuster: 'Myth: "Air conditioning automatically filters out traffic fumes." Fact: Without recirculation mode enabled, fresh air vents suck in direct diesel exhaust from the tailpipe of the truck ahead of you.',
    scienceBacking: 'Atmospheric Environment (Hudda et al., 2012): Cabin recirculation mode reduces in-cabin particulate matter exposure by 80% to 90% in urban arterial traffic.'
  }
];
