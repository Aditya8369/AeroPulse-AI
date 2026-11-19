export interface KnowledgeArticle {
  keywords: string[];
  title: string;
  answer: string;
  recommendations: string[];
  sources: { title: string; publisher: string }[];
}

export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    keywords: ['corsi', 'box', 'diy', 'filter', 'rosenthal', 'build', 'cheap', 'purifier', 'merv', 'cost'],
    title: 'How to Build and Optimize a Corsi-Rosenthal DIY Air Purifier',
    answer: `The Corsi-Rosenthal Box (CR Box) is an open-source, scientifically validated DIY air cleaner engineered by Dr. Richard Corsi and Jim Rosenthal. It uses one standard 20-inch box fan and four MERV 13 furnace filters (20"x20"x2") arranged in a cube with a cardboard bottom and top shroud. 

Why it works:
1. Massive Surface Area: Using 4 pleated filters dramatically reduces air resistance (static pressure), allowing the fan to move 350-550 cubic feet of air per minute (CFM).
2. Clean Air Delivery Rate (CADR): Matches or beats commercial HEPA purifiers that retail for $400-$700, while costing only $45-$75 total.
3. The Shroud Secret: Cutting a circular cardboard shroud (14-15" diameter hole) and taping it to the front face of the box fan prevents tip vortex backflow, boosting clean air throughput by up to 30%.
4. Safe Motors: Use box fans built after 2012 that include internal thermal fuses for safe continuous 24/7 operation.`,
    recommendations: [
      'Use only MERV 13 or MERV 14 filters (never fiberglass MERV 8).',
      'Tape all filter edges with duct tape or painter\'s tape to eliminate leaks.',
      'Always add the 14" circular cardboard shroud on the exhaust face.',
      'Replace filters every 6 to 9 months depending on particulate load.'
    ],
    sources: [
      { title: 'Corsi-Rosenthal Box Testing and Performance', publisher: 'UC Davis Air Quality Research Center' },
      { title: 'DIY Air Cleaners: EPA Research', publisher: 'US Environmental Protection Agency (EPA)' }
    ]
  },
  {
    keywords: ['inversion', 'thermal', 'morning', 'fog', 'smog', 'why', 'winter', 'exercise', 'jogging', 'running'],
    title: 'Why Winter Thermal Inversion Makes Morning Jogging Dangerous',
    answer: `Thermal inversion is an atmospheric phenomenon where normal vertical temperature gradients are reversed: warm air sits on top of a dense layer of cold, stagnant ground air. This acts like an airtight lid over urban valleys and plains.

Key scientific facts:
1. Ground Cooling: During long, clear winter nights, the ground radiates heat into space. By 4:00 AM - 7:00 AM, the inversion boundary layer compresses down to 100-200 meters above ground.
2. Trapped Emissions: Tailpipes, brick kilns, domestic woodstoves, and industrial emissions get trapped in this ultra-shallow layer.
3. Alveolar Deposition: Jogging outdoors increases your breathing minute volume by 500% (from 6 L/min to 30-50 L/min). Because PM2.5 bypasses nasal filtration, deep mouth-breathing deposits millions of toxic carbon and sulfate particles directly into pulmonary alveoli and enters the bloodstream.`,
    recommendations: [
      'Shift cardiovascular exercise indoors during smog alerts.',
      'If exercising outdoors is essential, schedule it between 12:30 PM and 3:00 PM when solar thermal lift temporarily dilutes the smog.',
      'Monitor real-time PM2.5 levels rather than relying on visual fog cues.'
    ],
    sources: [
      { title: 'Meteorological Drivers of Severe Winter Smog', publisher: 'Atmospheric Chemistry & Physics (ACP)' },
      { title: 'Exercise-Induced Respiratory Inhalation of Particulate Matter', publisher: 'The Lancet Respiratory Medicine' }
    ]
  },
  {
    keywords: ['cigarette', 'cigarettes', 'equivalent', 'smoking', 'berkeley', 'health', 'lungs', 'cancer'],
    title: 'Calculating Cigarette Equivalence of PM2.5 Inhalation',
    answer: `The cigarette equivalence model was formulated by physicists Richard and Elizabeth Muller at Berkeley Earth (2015). 

The scientific conversion:
1. One standard cigarette burned and inhaled yields approximately 12 milligrams (12,000 µg) of toxic PM2.5 particles, of which roughly 22 µg of PM2.5 per cubic meter inhaled over a 24-hour period produces an equivalent long-term cardiovascular and carcinogenic mortality risk.
2. Formula: Number of Cigarettes/day = (PM2.5 in µg/m³) / 22.
3. Examples:
   - Living in an AQI zone with 220 µg/m³ PM2.5 for 24 hours is equivalent to smoking ~10 cigarettes per day.
   - Severe Delhi or Lahore winter days with 440 µg/m³ PM2.5 equal ~20 cigarettes (one full pack) inhaled by every man, woman, and newborn child.

By following AeroPulse indoor sanctuary hacks (maintaining indoor PM2.5 under 25 µg/m³), a family effectively "un-smokes" 8 to 18 cigarettes per person each day.`,
    recommendations: [
      'Seal sleeping zones to protect children during 8-hour sleep periods.',
      'Wear certified N95 masks when outside in AQI > 150 to cut inhaled particulate by up to 95%.',
      'Check your personalized cigarette equivalence metric in the AeroPulse Impact tab.'
    ],
    sources: [
      { title: 'Air Pollution and Cigarette Equivalence', publisher: 'Berkeley Earth (Muller & Muller)' },
      { title: 'Global Burden of Disease Study 2021', publisher: 'Institute for Health Metrics and Evaluation (IHME)' }
    ]
  },
  {
    keywords: ['mask', 'n95', 'ffp2', 'cloth', 'surgical', 'protect', 'wear', 'outdoor', 'breathe'],
    title: 'Mask Effectiveness: N95/FFP2 vs. Cloth and Surgical Masks',
    answer: `Winter smog is predominantly composed of sub-micron particles (PM2.5, typically between 0.1 and 1.0 micrometers). 

Comparative performance:
1. Cloth Masks: Provide only 10% to 25% filtration efficiency against PM2.5. Weave gaps in cotton or silk (50-200 microns) are hundreds of times larger than toxic particulates.
2. Surgical/Blue Paper Masks: While the electret meltblown fabric has decent material filtration (~60-70%), the loose side gaps allow up to 60% of inhaled air to bypass the filter completely through leakage paths.
3. Certified N95 / FFP2 / KF94 Respirators: Deliver 95%+ filtration against particles down to 0.075 microns due to electrostatically charged meltblown polypropylene fibers and a sealed facial perimeter.`,
    recommendations: [
      'Ensure a tight fit around the nose bridge with the malleable metal strip.',
      'Check the facial perimeter seal by exhaling sharply: no air should leak into your eyes or out the cheeks.',
      'Do not wash N95 respirators with soap or alcohol, as this destroys the electrostatic charge.'
    ],
    sources: [
      { title: 'Respiratory Protection and Particulate Filtration', publisher: 'NIOSH / CDC Guidance' },
      { title: 'Comparative Aerosol Penetration of Face Masks', publisher: 'Aerosol Science and Technology' }
    ]
  },
  {
    keywords: ['child', 'children', 'infant', 'baby', 'elderly', 'asthma', 'vulnerable', 'school', 'pregnant'],
    title: 'Protecting High-Risk Groups (Children, Seniors, Asthmatics)',
    answer: `Certain populations bear disproportionate physiological damage from severe winter smog:

1. Children & Infants: Breathe 2x to 3x more air per unit of body weight than adults. Their lungs are undergoing rapid alveolar multiplication (up to age 8). Toxic nanoparticles cross underdeveloped mucosal barriers and retard lung capacity growth permanently.
2. Pregnant Women: Inhaled ultrafine carbon particles can cross the placenta into the fetal bloodstream, increasing risks of preterm birth, low birth weight, and preeclampsia.
3. Asthmatics & COPD: High concentrations of NO2, ozone, and PM2.5 cause acute bronchospasm, mucosal edema, and increased sputum production.
4. Seniors (65+): Particulate matter triggers systemic vascular inflammation, arterial stiffness, and acute ischemic stroke or myocardial infarction within 24-48 hours of high smog spikes.`,
    recommendations: [
      'Schools should suspend outdoor physical education, morning assembly, and sports during AQI > 200.',
      'Asthmatics should carry rescue inhalers at all times and pre-medicate before inevitable outdoor transit.',
      'Keep indoor bedroom sanctuary PM2.5 under 15 µg/m³ for infants and elderly.',
      'Install indoor humidity control to keep nasal mucosa moist (40-50% RH).'
    ],
    sources: [
      { title: 'Air Pollution and Child Health: Prescribing Clean Air', publisher: 'World Health Organization (WHO)' },
      { title: 'Particulate Matter Air Pollution and Cardiovascular Disease', publisher: 'American Heart Association (AHA)' }
    ]
  },
  {
    keywords: ['plants', 'snake', 'spider', 'plant', 'nasa', 'purify', 'green', 'leaf'],
    title: 'The Truth About NASA Clean Air Plants vs. Winter Smog',
    answer: `One of the most persistent urban myths is that placing 2-3 snake plants or spider plants in a living room purifies smog. 

The scientific truth:
1. The 1989 NASA Clean Air Study tested plants in completely sealed, airtight, 1-cubic-meter plexiglass chambers filled with volatile organic chemicals (benzene, formaldehyde, trichloroethylene).
2. Real-world homes have air infiltration rates of 0.5 to 2.0 air changes per hour (ACH). Natural ventilation exchanges room air 100 to 1,000 times faster than a potted plant can metabolize chemicals.
3. Plants do NOT filter PM2.5, soot, or heavy smoke. They have no fans to draw air through a dense fibrous mesh.
4. To match the particulate clean air delivery rate (CADR) of a single budget $50 DIY Corsi-Rosenthal box, you would need over 500 to 1,000 potted plants packed wall-to-wall in a standard bedroom.`,
    recommendations: [
      'Enjoy houseplants for mental wellness, humidity stabilization, and indoor aesthetic beauty.',
      'Do not rely on houseplants as your primary air defense against winter smog.',
      'Prioritize mechanical filtration (HEPA or MERV 13 CR Boxes) for particulate removal.'
    ],
    sources: [
      { title: 'Potted plants do not improve indoor air quality: a review', publisher: 'Journal of Exposure Science & Environmental Epidemiology (2019)' },
      { title: 'Indoor Air Quality: Myths vs Science', publisher: 'Drexel University Indoor Environmental Research' }
    ]
  }
];
