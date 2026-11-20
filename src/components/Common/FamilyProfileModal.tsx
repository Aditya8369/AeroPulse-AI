import React, { useEffect } from 'react';
import { Users, X, Check } from 'lucide-react';
import { 
  UserFamilyProfile, 
  VulnerabilityGroup,
  HousingType,
  HeatingType,
  CookingFuel,
  CommuteMode
} from '../../types/aqi';

interface FamilyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserFamilyProfile;
  onSaveProfile: (profile: UserFamilyProfile) => void;
}

const ALL_VULNERABILITY_GROUPS: readonly VulnerabilityGroup[] = [
  'Infant & Toddler (0-4)',
  'School-Age Child (5-17)',
  'Elderly (65+)',
  'Asthma / COPD / Respiratory',
  'Cardiovascular Condition',
  'Pregnant',
  'Active Outdoor Commuter',
  'Pet Owner'
] as const;

const HOUSING_OPTIONS: readonly { value: HousingType; label: string }[] = [
  { value: 'Apartment', label: 'Apartment / Flat' },
  { value: 'Independent House', label: 'Independent Multi-Story House' },
  { value: 'Basement', label: 'Ground Floor / Basement' },
  { value: 'High-Rise (Floor 10+)', label: 'High-Rise (Floor 10+)' },
] as const;

const HEATING_OPTIONS: readonly { value: HeatingType; label: string }[] = [
  { value: 'Electric Heat Pump', label: 'Electric Heat Pump / AC Reverse' },
  { value: 'Radiator (Hydronic)', label: 'Closed Hydronic Radiator' },
  { value: 'Open Coil Space Heater', label: 'Electric Resistance Coil' },
  { value: 'Gas / Kerosene Heater', label: 'Unvented Gas / Kerosene Heater' },
  { value: 'Biomass / Wood Stove', label: 'Biomass Fireplace / Chulha' },
] as const;

const COOKING_OPTIONS: readonly { value: CookingFuel; label: string }[] = [
  { value: 'Induction / Electric', label: 'Induction Cooktop (Zero NO2)' },
  { value: 'Piped Natural Gas', label: 'Piped Natural Gas (PNG)' },
  { value: 'LPG Cylinder', label: 'LPG Cylinder' },
  { value: 'Solid Fuel / Coal', label: 'Solid Biomass / Wood / Coal' },
] as const;

const COMMUTE_OPTIONS: readonly { value: CommuteMode; label: string }[] = [
  { value: 'Metro / Train', label: 'Electric Metro / Rail (Filtered)' },
  { value: 'Bus', label: 'Public Transit Bus' },
  { value: 'Gas/Diesel Car', label: 'Gas/Diesel Car (Cabin Recirculation)' },
  { value: 'Two-Wheeler (Motorcycle/Scooter)', label: 'Motorcycle / Scooter (Direct Inversion Inhalation)' },
  { value: 'Bicycle / Walking', label: 'Walking / Cycling' },
  { value: 'Work from Home', label: 'Work from Home (Remote)' },
] as const;

export const FamilyProfileModal: React.FC<FamilyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [draft, setDraft] = React.useState<UserFamilyProfile>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleGroup = (group: VulnerabilityGroup) => {
    setDraft(prev => {
      const exists = prev.householdMembers.includes(group);
      const updated = exists
        ? prev.householdMembers.filter(g => g !== group)
        : [...prev.householdMembers, group];
      return { ...prev, householdMembers: updated };
    });
  };

  const handleSave = () => {
    onSaveProfile(draft);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" aria-hidden="true" />
            <h2 id="profile-modal-title" className="font-bold text-base text-slate-900 dark:text-white">
              Household Air Exposure Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Vulnerability Cohorts */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            1. Select High-Risk Household Members:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_VULNERABILITY_GROUPS.map((group) => {
              const selected = draft.householdMembers.includes(group);
              return (
                <button
                  key={group}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleGroup(group)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    selected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-700 text-sky-900 dark:text-sky-200 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{group}</span>
                  {selected && <Check className="w-4 h-4 text-sky-600 shrink-0 ml-1" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Housing & Infrastructure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label htmlFor="housing-type-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Housing Structure
            </label>
            <select
              id="housing-type-select"
              value={draft.housingType}
              onChange={(e) => setDraft(prev => ({ ...prev, housingType: e.target.value as HousingType }))}
              className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {HOUSING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="heating-type-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Winter Heating System
            </label>
            <select
              id="heating-type-select"
              value={draft.heatingType}
              onChange={(e) => setDraft(prev => ({ ...prev, heatingType: e.target.value as HeatingType }))}
              className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {HEATING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cooking-fuel-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Kitchen Cooking Fuel
            </label>
            <select
              id="cooking-fuel-select"
              value={draft.cookingFuel}
              onChange={(e) => setDraft(prev => ({ ...prev, cookingFuel: e.target.value as CookingFuel }))}
              className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {COOKING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="commute-mode-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Daily Commute Mode
            </label>
            <select
              id="commute-mode-select"
              value={draft.commuteMode}
              onChange={(e) => setDraft(prev => ({ ...prev, commuteMode: e.target.value as CommuteMode }))}
              className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {COMMUTE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Save Household Profile
          </button>
        </div>

      </div>
    </div>
  );
};
