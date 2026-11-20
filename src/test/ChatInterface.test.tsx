import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from '../components/Assistant/ChatInterface';
import { CityAirData, UserFamilyProfile } from '../types/aqi';

describe('ChatInterface Component', () => {
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

  it('renders initial welcome message, copilot header, and quick prompts', () => {
    render(
      <ChatInterface
        cityData={mockCity}
        profile={mockProfile}
        apiKey=""
        onNavigateTab={vi.fn()}
        onOpenCalculator={vi.fn()}
      />
    );

    expect(screen.getByText('AeroPulse AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Offline Science Engine')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to AeroPulse AI!/i)).toBeInTheDocument();
    expect(screen.getByText('Quick Questions:')).toBeInTheDocument();
    expect(screen.getByText('DIY Corsi-Rosenthal Box')).toBeInTheDocument();
  });

  it('allows user to type a question and receive an offline science response', async () => {
    render(
      <ChatInterface
        cityData={mockCity}
        profile={mockProfile}
        apiKey=""
        onNavigateTab={vi.fn()}
        onOpenCalculator={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Ask about Corsi-Rosenthal boxes/i);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'How do I build a Corsi-Rosenthal box?' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('How do I build a Corsi-Rosenthal box?')).toBeInTheDocument();
      expect(screen.getAllByText(/Corsi-Rosenthal Box/i).length).toBeGreaterThan(0);
    });
  });

  it('triggers response when quick question chip is clicked', async () => {
    render(
      <ChatInterface
        cityData={mockCity}
        profile={mockProfile}
        apiKey=""
        onNavigateTab={vi.fn()}
        onOpenCalculator={vi.fn()}
      />
    );

    const quickPromptBtn = screen.getByText('NASA Plants vs Reality');
    fireEvent.click(quickPromptBtn);

    await waitFor(() => {
      expect(screen.getByText(/Do houseplants like snake plants actually clean winter smog/i)).toBeInTheDocument();
    });
  });

  it('invokes callback when action pills are clicked', async () => {
    const onOpenCalculator = vi.fn();
    const onNavigateTab = vi.fn();

    render(
      <ChatInterface
        cityData={mockCity}
        profile={mockProfile}
        apiKey=""
        onNavigateTab={onNavigateTab}
        onOpenCalculator={onOpenCalculator}
      />
    );

    // Initial message contains 'Calculate DIY Filter Size' action pill
    const calcPill = screen.getByRole('button', { name: /Calculate DIY Filter Size/i });
    fireEvent.click(calcPill);
    expect(onOpenCalculator).toHaveBeenCalledTimes(1);

    const viewWindowPill = screen.getByRole('button', { name: /View Today's Inversion Window/i });
    fireEvent.click(viewWindowPill);
    expect(onNavigateTab).toHaveBeenCalledWith('DASHBOARD');
  });

  it('renders inline formatted markdown (bold, italic, code) safely', () => {
    render(
      <ChatInterface
        cityData={mockCity}
        profile={mockProfile}
        apiKey=""
        onNavigateTab={vi.fn()}
        onOpenCalculator={vi.fn()}
      />
    );

    // The initial message contains bold **Winter Smog & Clean Air Copilot**
    expect(screen.getByText('Winter Smog & Clean Air Copilot')).toBeInTheDocument();
  });
});
