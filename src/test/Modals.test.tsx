import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiKeyModal } from '../components/Common/ApiKeyModal';
import { FamilyProfileModal } from '../components/Common/FamilyProfileModal';
import { CadrModal } from '../components/Common/CadrModal';
import { UserFamilyProfile } from '../types/aqi';

describe('Modal Dialog Components', () => {
  const mockProfile: UserFamilyProfile = {
    cityId: 'delhi-ncr',
    householdMembers: ['School-Age Child (5-17)'],
    housingType: 'Apartment',
    heatingType: 'Electric Heat Pump',
    cookingFuel: 'Piped Natural Gas',
    commuteMode: 'Gas/Diesel Car',
    hasAirPurifier: true,
    purifierCount: 1
  };

  describe('ApiKeyModal', () => {
    it('returns null when isOpen is false', () => {
      const { container } = render(
        <ApiKeyModal isOpen={false} onClose={vi.fn()} apiKey="" onSaveKey={vi.fn()} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('validates and saves a valid Gemini API key', () => {
      const onSaveKey = vi.fn();
      const onClose = vi.fn();

      render(
        <ApiKeyModal isOpen={true} onClose={onClose} apiKey="" onSaveKey={onSaveKey} />
      );

      const input = screen.getByLabelText(/Google Gemini API Key/i);
      const saveBtn = screen.getByRole('button', { name: /Save Key/i });

      // Valid 39-character Gemini key format
      fireEvent.change(input, { target: { value: 'AIzaSyA1234567890abcdefghijklmnopqrstuv' } });
      fireEvent.click(saveBtn);

      expect(onSaveKey).toHaveBeenCalledWith('AIzaSyA1234567890abcdefghijklmnopqrstuv');
      expect(onClose).toHaveBeenCalled();
    });

    it('displays error message when key format is invalid', () => {
      const onSaveKey = vi.fn();

      render(
        <ApiKeyModal isOpen={true} onClose={vi.fn()} apiKey="" onSaveKey={onSaveKey} />
      );

      const input = screen.getByLabelText(/Google Gemini API Key/i);
      const saveBtn = screen.getByRole('button', { name: /Save Key/i });

      fireEvent.change(input, { target: { value: 'invalid_short_key' } });
      fireEvent.click(saveBtn);

      expect(screen.getByRole('alert')).toHaveTextContent(/Key format looks invalid/i);
      expect(onSaveKey).not.toHaveBeenCalled();
    });

    it('clears stored API key when Clear Key is clicked', () => {
      const onSaveKey = vi.fn();
      const onClose = vi.fn();

      render(
        <ApiKeyModal
          isOpen={true}
          onClose={onClose}
          apiKey="AIzaSyA1234567890abcdefghijklmnopqrstuv"
          onSaveKey={onSaveKey}
        />
      );

      const clearBtn = screen.getByRole('button', { name: /Clear Key/i });
      fireEvent.click(clearBtn);

      expect(onSaveKey).toHaveBeenCalledWith('');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('FamilyProfileModal', () => {
    it('returns null when isOpen is false', () => {
      const { container } = render(
        <FamilyProfileModal isOpen={false} onClose={vi.fn()} profile={mockProfile} onSaveProfile={vi.fn()} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('toggles vulnerability cohorts and updates profile options on save', () => {
      const onSaveProfile = vi.fn();
      const onClose = vi.fn();

      render(
        <FamilyProfileModal
          isOpen={true}
          onClose={onClose}
          profile={mockProfile}
          onSaveProfile={onSaveProfile}
        />
      );

      // Toggle 'Infant & Toddler (0-4)'
      const infantBtn = screen.getByRole('button', { name: /Infant & Toddler/i });
      fireEvent.click(infantBtn);

      // Change housing select
      const housingSelect = screen.getByLabelText(/Housing Structure/i);
      fireEvent.change(housingSelect, { target: { value: 'Independent House' } });

      const saveBtn = screen.getByRole('button', { name: /Save Household Profile/i });
      fireEvent.click(saveBtn);

      expect(onSaveProfile).toHaveBeenCalledWith(expect.objectContaining({
        housingType: 'Independent House',
        householdMembers: expect.arrayContaining(['School-Age Child (5-17)', 'Infant & Toddler (0-4)'])
      }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('CadrModal', () => {
    it('returns null when isOpen is false', () => {
      const { container } = render(
        <CadrModal isOpen={false} onClose={vi.fn()} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders CADR calculator and calls onClose when close button or Escape is pressed', () => {
      const onClose = vi.fn();

      render(<CadrModal isOpen={true} onClose={onClose} />);

      expect(screen.getByText(/Corsi-Rosenthal Box Sizing & CADR Calculator/i)).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: /Close CADR Calculator/i });
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });
});
