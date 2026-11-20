import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoutineScheduler } from '../components/Routines/RoutineScheduler';
import { PersonalImpactMetrics } from '../components/Impact/PersonalImpactMetrics';
import { ScheduledActivity } from '../types/routine';
import { CityAirData, UserFamilyProfile } from '../types/aqi';
import { ImpactMetrics } from '../types/impact';

describe('RoutineScheduler Component', () => {
  const mockCity: CityAirData = {
    cityId: 'delhi-ncr',
    cityName: 'Delhi NCR',
    country: 'India',
    currentAQI: 382,
    category: 'Hazardous',
    pollutants: { pm25: 324.5, pm10: 468.2, no2: 89.4, o3: 24.1, co: 3.2, so2: 18.7 },
    temperatureC: 13,
    humidityPercent: 78,
    windSpeedKmh: 4.2,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 140,
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: []
  };

  const mockProfile: UserFamilyProfile = {
    cityId: 'delhi-ncr',
    householdMembers: ['School-Age Child (5-17)', 'Asthma / COPD / Respiratory'],
    housingType: 'Apartment',
    heatingType: 'Electric Heat Pump',
    cookingFuel: 'Piped Natural Gas',
    commuteMode: 'Gas/Diesel Car',
    hasAirPurifier: true,
    purifierCount: 1
  };

  const mockActivities: ScheduledActivity[] = [
    {
      id: 'act-1',
      timeSlot: '06:00 - 08:30',
      activityName: 'Morning Jog & Exercise Shift',
      defaultHabit: 'Outdoor jogging along main arterial roads',
      recommendedAlternative: 'Indoor treadmill / yoga with Corsi-Rosenthal filtration',
      exposureReductionPercentage: 85,
      emissionReductionGramsCO2: 0,
      reason: 'Peak ground inversion traps particulate',
      isAdopted: true
    },
    {
      id: 'act-2',
      timeSlot: '08:30 - 09:30',
      activityName: 'School Commute & Transit Mode',
      defaultHabit: 'Solo diesel SUV school drop-off',
      recommendedAlternative: 'Electric Metro or fitted N95 respirator + cabin recirculation',
      exposureReductionPercentage: 75,
      emissionReductionGramsCO2: 1600,
      reason: 'School gate idling creates micro-hotspots',
      isAdopted: false
    }
  ];

  it('renders activities, adoption counters, and CO2 avoided summary', () => {
    render(
      <RoutineScheduler
        activities={mockActivities}
        onToggleActivity={vi.fn()}
        cityData={mockCity}
        profile={mockProfile}
      />
    );

    expect(screen.getByText(/Low-Emission Daily Routines & Inversion Timing/i)).toBeInTheDocument();
    expect(screen.getByText('1 / 2 Adopted')).toBeInTheDocument();
    expect(screen.getByText('Morning Jog & Exercise Shift')).toBeInTheDocument();
    expect(screen.getByText('School Commute & Transit Mode')).toBeInTheDocument();
  });

  it('invokes onToggleActivity when toggle button is clicked', () => {
    const onToggle = vi.fn();

    render(
      <RoutineScheduler
        activities={mockActivities}
        onToggleActivity={onToggle}
        cityData={mockCity}
        profile={mockProfile}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /Toggle adoption for Morning Jog/i });
    fireEvent.click(toggleBtn);

    expect(onToggle).toHaveBeenCalledWith('act-1');
  });

  it('shows tailored household advisory tip when family profile has members', () => {
    render(
      <RoutineScheduler
        activities={mockActivities}
        onToggleActivity={vi.fn()}
        cityData={mockCity}
        profile={mockProfile}
      />
    );

    expect(screen.getAllByText(/Tailored for household: prioritize strict avoidance/i).length).toBeGreaterThan(0);
  });
});

describe('PersonalImpactMetrics Component', () => {
  const mockCity: CityAirData = {
    cityId: 'delhi-ncr',
    cityName: 'Delhi NCR',
    country: 'India',
    currentAQI: 382,
    category: 'Hazardous',
    pollutants: { pm25: 324.5, pm10: 468.2, no2: 89.4, o3: 24.1, co: 3.2, so2: 18.7 },
    temperatureC: 13,
    humidityPercent: 78,
    windSpeedKmh: 4.2,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 140,
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: []
  };

  const mockMetrics: ImpactMetrics = {
    totalPM25AvoidedMicrograms: 1420,
    cigarettesEquivalenceSaved: 4.3,
    co2EmissionsSavedKg: 2.5,
    indoorAQIImprovementPercent: 65,
    activeActionsCount: 3,
    healthRiskReductionSummary: 'Moderate exposure shield. Commute and sleep protection active.'
  };

  it('renders all 4 quantified impact metrics cards and clinical summary', () => {
    render(<PersonalImpactMetrics metrics={mockMetrics} cityData={mockCity} />);

    expect(screen.getByText(/Your Quantified Clean Air Impact/i)).toBeInTheDocument();
    expect(screen.getByText('4.3')).toBeInTheDocument();
    expect(screen.getByText('1420')).toBeInTheDocument();
    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('+65%')).toBeInTheDocument();
    expect(screen.getByText(/Home Air Purity Lift/i)).toBeInTheDocument();
    expect(screen.getByText(mockMetrics.healthRiskReductionSummary)).toBeInTheDocument();
  });

  it('handles milestone sharing to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    });

    render(<PersonalImpactMetrics metrics={mockMetrics} cityData={mockCity} />);

    const shareBtn = screen.getByRole('button', { name: /Share Milestone/i });
    fireEvent.click(shareBtn);

    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('1420µg of toxic PM2.5'));
    expect(screen.getByText('Impact Copied!')).toBeInTheDocument();
  });
});
