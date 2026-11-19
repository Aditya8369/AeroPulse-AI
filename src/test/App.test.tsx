import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { App } from '../App';

describe('App component integration', () => {
  it('renders the brand name and main navigation tabs', () => {
    render(<App />);

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
    expect(screen.getByText(/1. Room Dimensions \(Feet\)/i)).toBeInTheDocument();
  });
});
