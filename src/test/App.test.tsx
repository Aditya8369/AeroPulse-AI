import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

describe('App component integration', () => {
  it('renders the brand name and main navigation tabs with skip link', () => {
    render(<App />);

    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    expect(screen.getAllByText('AeroPulse AI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Smog & Inversion')).toBeInTheDocument();
    expect(screen.getByText('AeroPulse Copilot')).toBeInTheDocument();
    expect(screen.getByText('Low-Emission Routines')).toBeInTheDocument();
    expect(screen.getByText('IAQ Hacks & DIY Lab')).toBeInTheDocument();
    expect(screen.getByText('Direct Impact')).toBeInTheDocument();
    expect(screen.getByText('Community Hub')).toBeInTheDocument();
  });

  it('navigates to the Copilot tab and displays the AI chat interface', () => {
    render(<App />);

    const copilotTab = screen.getByRole('tab', { name: /AeroPulse Copilot/i });
    fireEvent.click(copilotTab);

    expect(screen.getByText('AeroPulse AI Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about Corsi-Rosenthal boxes/i)).toBeInTheDocument();
  });

  it('navigates to IAQ Hacks & DIY Lab tab and displays CADR calculator', () => {
    render(<App />);

    const iaqTab = screen.getByRole('tab', { name: /IAQ Hacks & DIY Lab/i });
    fireEvent.click(iaqTab);

    expect(screen.getByText(/Corsi-Rosenthal Box Sizing & CADR Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter Hacks:/i)).toBeInTheDocument();
  });

  it('navigates to Low-Emission Routines and allows toggling activities', () => {
    render(<App />);

    const routinesTab = screen.getByRole('tab', { name: /Low-Emission Routines/i });
    fireEvent.click(routinesTab);

    expect(screen.getByText(/Low-Emission Daily Routines & Inversion Timing/i)).toBeInTheDocument();

    // Toggle button for first activity
    const toggleButtons = screen.getAllByRole('button', { name: /Toggle adoption for/i });
    expect(toggleButtons.length).toBeGreaterThan(0);
    const firstToggle = toggleButtons[0];
    const initialPressed = firstToggle.getAttribute('aria-pressed');

    fireEvent.click(firstToggle);
    expect(firstToggle.getAttribute('aria-pressed')).not.toBe(initialPressed);
  });

  it('navigates to Direct Impact and displays quantified Berkeley Earth metrics', () => {
    render(<App />);

    const impactTab = screen.getByRole('tab', { name: /Direct Impact/i });
    fireEvent.click(impactTab);

    expect(screen.getByText(/Your Quantified Clean Air Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Cigarette Equiv. Saved/i)).toBeInTheDocument();
    expect(screen.getByText(/PM2.5 Inhalation Avoided/i)).toBeInTheDocument();
  });

  it('navigates to Community Hub and displays pledges and smoke reports', () => {
    render(<App />);

    const communityTab = screen.getByRole('tab', { name: /Community Hub/i });
    fireEvent.click(communityTab);

    expect(screen.getByText(/Neighborhood Action Pledges/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Smoke & Pollution Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Smoke or Dust Plume/i)).toBeInTheDocument();
  });

  it('opens and closes the Household Profile Modal via Escape key', () => {
    render(<App />);

    const profileButton = screen.getByRole('button', { name: /Household profile:/i });
    fireEvent.click(profileButton);

    expect(screen.getByText('Household Air Exposure Profile')).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText('Household Air Exposure Profile')).not.toBeInTheDocument();
  });

  it('allows switching cities from the header dropdown', () => {
    render(<App />);

    const select = screen.getByRole('combobox', { name: /Select Urban Location/i });
    fireEvent.change(select, { target: { value: 'beijing' } });

    expect(screen.getByText(/Beijing, China/i)).toBeInTheDocument();
  });
});
