import { CommunityPledge, CommunityReport } from '../types/impact';

export const INITIAL_COMMUNITY_PLEDGES: CommunityPledge[] = [
  {
    id: 'pledge-no-open-burning',
    title: 'Zero Waste & Leaf Burning Pledge',
    description: 'Commit to never incinerating garden leaves, plastics, or garbage in the neighborhood. Compost or bag green waste instead.',
    supportersCount: 1420,
    estimatedCommunityPM25ReductionKgPerWeek: 310,
    category: 'No Open Fires'
  },
  {
    id: 'pledge-school-carpool',
    title: 'Neighborhood School Run Carpool Syndicate',
    description: 'Combine morning school drop-offs: 1 vehicle for 4 children instead of 4 idling SUVs outside the school gates.',
    supportersCount: 890,
    estimatedCommunityPM25ReductionKgPerWeek: 185,
    category: 'Green School Run'
  },
  {
    id: 'pledge-diy-purifier-build',
    title: 'Community Corsi-Rosenthal Box Library',
    description: 'Assemble and place community-built CR Boxes in local senior centers, government schools, and daycare centers.',
    supportersCount: 460,
    estimatedCommunityPM25ReductionKgPerWeek: 95,
    category: 'Shared DIY Purifiers'
  },
  {
    id: 'pledge-public-transit-winter',
    title: 'Winter Smog Metro Commuter Challenge',
    description: 'Switch at least 3 out of 5 work commute days from solo petrol/diesel cars to electric metro rail or zero-emission bus.',
    supportersCount: 2310,
    estimatedCommunityPM25ReductionKgPerWeek: 540,
    category: 'Clean Transit'
  }
];

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-001',
    type: 'Open Biomass/Stubble Burning',
    locationDescription: 'Empty municipal plot behind Sector 14 market, near railway line',
    timestamp: '25 mins ago',
    status: 'Reported to Municipality',
    upvotes: 42,
    notes: 'Large smoldering pile of plastic packaging and dry branches; dense acrid smoke drifting towards residential blocks.'
  },
  {
    id: 'rep-002',
    type: 'Construction Dust Plume',
    locationDescription: 'Main Highway Flyover construction site (Pillar 48-52)',
    timestamp: '1 hour ago',
    status: 'Verified',
    upvotes: 29,
    notes: 'Uncovered dry gravel heaps with no water sprinkling screens active during high winds.'
  },
  {
    id: 'rep-003',
    type: 'Idling Heavy Vehicles',
    locationDescription: 'Interstate Bus Terminal entry gate',
    timestamp: '3 hours ago',
    status: 'Investigating',
    upvotes: 18,
    notes: '15+ older diesel interstate buses idling for over 45 minutes on the perimeter road.'
  }
];
