import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AQIGauge } from '../components/Dashboard/AQIGauge';
import { CityAirData } from '../types/aqi';

describe('AQIGauge Component', () => {
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

  it('renders city location, AQI value, and health category badge', () => {
    render(<AQIGauge cityData={mockCity} />);

    expect(screen.getByText('Delhi NCR, India')).toBeInTheDocument();
    expect(screen.getByText('382')).toBeInTheDocument();
    expect(screen.getByText('Hazardous')).toBeInTheDocument();
  });

  it('displays Berkeley Earth cigarette equivalence correctly', () => {
    render(<AQIGauge cityData={mockCity} />);

    // 324.5 / 22 = ~14.8 cigarettes/day
    expect(screen.getByText(/Inhaling 24h outdoor air ≈/i)).toBeInTheDocument();
    expect(screen.getByText(/14.8 cigarettes\/day/i)).toBeInTheDocument();
  });

  it('displays active thermal inversion status and boundary height', () => {
    render(<AQIGauge cityData={mockCity} />);

    expect(screen.getByText('Thermal Inversion Dynamics')).toBeInTheDocument();
    expect(screen.getByText('Trapping Active')).toBeInTheDocument();
    expect(screen.getByText(/boundary at ~140m is trapping smoke/i)).toBeInTheDocument();
  });

  it('renders all six primary atmospheric pollutant cards', () => {
    render(<AQIGauge cityData={mockCity} />);

    expect(screen.getByText('324.5')).toBeInTheDocument(); // PM2.5
    expect(screen.getByText('468.2')).toBeInTheDocument(); // PM10
    expect(screen.getByText('89.4')).toBeInTheDocument();  // NO2
    expect(screen.getByText('24.1')).toBeInTheDocument();  // O3
    expect(screen.getByText('3.2')).toBeInTheDocument();   // CO
    expect(screen.getByText('18.7')).toBeInTheDocument();  // SO2
  });
});
