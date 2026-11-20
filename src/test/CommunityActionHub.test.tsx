import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommunityActionHub } from '../components/Community/CommunityActionHub';
import { CityAirData } from '../types/aqi';
import { safeLocalStorageClear } from '../utils/storage';

describe('CommunityActionHub Component', () => {
  const mockCity: CityAirData = {
    cityId: 'delhi-ncr',
    cityName: 'Delhi NCR',
    country: 'India',
    currentAQI: 382,
    category: 'Hazardous',
    pollutants: {
      pm25: 324.5,
      pm10: 468.2,
      no2: 89.4,
      o3: 24.1,
      co: 3.2,
      so2: 18.7
    },
    temperatureC: 13,
    humidityPercent: 78,
    windSpeedKmh: 4.2,
    inversionLayerActive: true,
    thermalInversionHeightMeters: 140,
    dominantPollutant: 'PM2.5',
    updatedAt: new Date().toISOString(),
    hourlyForecast: []
  };

  beforeEach(() => {
    safeLocalStorageClear();
  });

  it('renders neighborhood action pledges and live pollution reports', () => {
    render(<CommunityActionHub cityData={mockCity} />);

    expect(screen.getByText(/Community Clean Air Network — Delhi NCR/i)).toBeInTheDocument();
    expect(screen.getByText('Neighborhood Action Pledges')).toBeInTheDocument();
    expect(screen.getByText('Live Smoke & Pollution Reports')).toBeInTheDocument();
    expect(screen.getByText('Zero Waste & Leaf Burning Pledge')).toBeInTheDocument();
  });

  it('allows joining and withdrawing from a community pledge', () => {
    render(<CommunityActionHub cityData={mockCity} />);

    const joinButtons = screen.getAllByRole('button', { name: /Join Pledge/i });
    const firstPledgeBtn = joinButtons[0];

    // Join pledge
    fireEvent.click(firstPledgeBtn);
    expect(screen.getByRole('button', { name: /Pledged/i })).toBeInTheDocument();

    // Withdraw from pledge
    const pledgedBtn = screen.getByRole('button', { name: /Pledged/i });
    fireEvent.click(pledgedBtn);
    expect(firstPledgeBtn).toHaveTextContent('Join Pledge');
  });

  it('allows upvoting/verifying a community smoke report', () => {
    render(<CommunityActionHub cityData={mockCity} />);

    const verifyButtons = screen.getAllByRole('button', { name: /Verified by Neighbors/i });
    const firstReportVerifyBtn = verifyButtons[0];
    const initialText = firstReportVerifyBtn.textContent;

    fireEvent.click(firstReportVerifyBtn);
    expect(firstReportVerifyBtn.getAttribute('aria-pressed')).toBe('true');

    // Clicking again removes verification
    fireEvent.click(firstReportVerifyBtn);
    expect(firstReportVerifyBtn.getAttribute('aria-pressed')).toBe('false');
    expect(firstReportVerifyBtn.textContent).toBe(initialText);
  });

  it('submits a new smoke report and adds it to the report feed', () => {
    render(<CommunityActionHub cityData={mockCity} />);

    const openReportModalBtn = screen.getByRole('button', { name: /Report Smoke or Dust Plume/i });
    fireEvent.click(openReportModalBtn);

    expect(screen.getByText('Report Illegal Burning or Dust Incident')).toBeInTheDocument();

    const locationInput = screen.getByLabelText(/Exact Landmark \/ Location/i);
    const notesInput = screen.getByLabelText(/Additional Notes/i);
    const submitBtn = screen.getByRole('button', { name: /Submit Community Report/i });

    fireEvent.change(locationInput, { target: { value: 'Near Gate 4 Community Center' } });
    fireEvent.change(notesInput, { target: { value: 'Heavy plastic burning pile visible' } });
    fireEvent.click(submitBtn);

    // Modal closes
    expect(screen.queryByText('Report Illegal Burning or Dust Incident')).not.toBeInTheDocument();

    // New report is in the feed
    expect(screen.getByText('Near Gate 4 Community Center')).toBeInTheDocument();
    expect(screen.getByText('Heavy plastic burning pile visible')).toBeInTheDocument();
  });

  it('cancels the report modal via Cancel button or Escape key', () => {
    render(<CommunityActionHub cityData={mockCity} />);

    fireEvent.click(screen.getByRole('button', { name: /Report Smoke or Dust Plume/i }));
    expect(screen.getByText('Report Illegal Burning or Dust Incident')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText('Report Illegal Burning or Dust Incident')).not.toBeInTheDocument();
  });
});
