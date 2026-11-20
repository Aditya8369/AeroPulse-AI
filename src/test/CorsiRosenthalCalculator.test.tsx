import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CorsiRosenthalCalculator } from '../components/IAQLab/CorsiRosenthalCalculator';

describe('CorsiRosenthalCalculator Component', () => {
  it('renders default room dimensions and calculations correctly', () => {
    render(<CorsiRosenthalCalculator />);

    expect(screen.getByText(/Corsi-Rosenthal Box Sizing & CADR Calculator/i)).toBeInTheDocument();
    // Default 16 * 14 * 9 = 2016 cu. ft.
    expect(screen.getByText('2016 cu. ft.')).toBeInTheDocument();
    // Default 4-filter MERV 13 is 480 CFM CADR
    expect(screen.getByText('480')).toBeInTheDocument();
    expect(screen.getByText('✓ Fully Sufficient')).toBeInTheDocument();
  });

  it('updates room volume and required CADR when room dimensions change', () => {
    render(<CorsiRosenthalCalculator />);

    const lengthInput = screen.getByLabelText(/Length \(ft\)/i);
    const widthInput = screen.getByLabelText(/Width \(ft\)/i);
    const heightInput = screen.getByLabelText(/Height \(ft\)/i);

    fireEvent.change(lengthInput, { target: { value: '20' } });
    fireEvent.change(widthInput, { target: { value: '20' } });
    fireEvent.change(heightInput, { target: { value: '10' } });

    // 20 * 20 * 10 = 4000 cu. ft.
    expect(screen.getByText('4000 cu. ft.')).toBeInTheDocument();
    // Required CADR for 4000 cu ft at 5 ACH = (4000 * 5) / 60 = 333 CFM
    expect(screen.getByText(/Required: 333 CFM/i)).toBeInTheDocument();
  });

  it('switches to 5-Filter Compactor and updates CADR to 530 CFM', () => {
    render(<CorsiRosenthalCalculator />);

    const styleSelect = screen.getByLabelText(/Style/i);
    fireEvent.change(styleSelect, { target: { value: '5' } });

    expect(screen.getByText('530')).toBeInTheDocument();
    expect(screen.getByText(/1x Box Fan \+ 5x MERV 13 filters/i)).toBeInTheDocument();
  });

  it('switches filter media to MERV 14 and updates CADR accounting for static drop', () => {
    render(<CorsiRosenthalCalculator />);

    const mediaSelect = screen.getByLabelText(/Filter Media/i);
    fireEvent.change(mediaSelect, { target: { value: '14' } });

    // 480 * 0.95 = 456 CFM
    expect(screen.getByText('456')).toBeInTheDocument();
  });

  it('toggles the step-by-step assembly protocol accordion', () => {
    render(<CorsiRosenthalCalculator />);

    expect(screen.queryByText(/Official Open-Source Corsi-Rosenthal Assembly Protocol/i)).not.toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: /View Step-by-Step Build Instructions/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Official Open-Source Corsi-Rosenthal Assembly Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/The Cardboard Shroud Secret:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Hide Assembly Instructions/i }));
    expect(screen.queryByText(/Official Open-Source Corsi-Rosenthal Assembly Protocol/i)).not.toBeInTheDocument();
  });
});
