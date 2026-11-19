import React from 'react';
import { Users, X, Check, ShieldCheck } from 'lucide-react';
import { UserFamilyProfile, VulnerabilityGroup } from '../../types/aqi';

interface FamilyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserFamilyProfile;
  onSaveProfile: (profile: UserFamilyProfile) => void;
}

const ALL_VULNERABILITY_GROUPS: VulnerabilityGroup[] = [
  'Infant & Toddler (0-4)',
  'School-Age Child (5-17)',
  'Elderly (65+)',
  'Asthma / COPD / Respiratory',
  'Cardiovascular Condition',
  'Pregnant',
  'Active Outdoor Commuter',
  'Pet Owner'
];

export const FamilyProfileModal: React.FC<FamilyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [draft, setDraft] = React.useState<UserFamilyProfile>(profile);

  if (!isOpen) return null;

  const toggleGroup = (group: VulnerabilityGroup) => {
    const exists = draft.householdMembers.includes(group);
    const updated = exists
      ? draft.householdMembers.filter(g => g !== group)
      : [...draft.householdMembers, group];
    setDraft({ ...draft, householdMembers: updated });
  };

  const handleSave = () => {
    onSaveProfile(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Household Air Exposure Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
          >
            <X className="w-5 h-5" />
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
                  onClick={() => toggleGroup(group)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between cursor-pointer ${
                    selected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-700 text-sky-900 dark:text-sky-200 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{group}</span>
                  {selected && <Check className="w-4 h-4 text-sky-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Housing & Infrastructure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Housing Structure
            </label>
            <select
              value={draft.housingType}
              onChange={(e) => setDraft({ ...draft, housingType: e.target.value as any })}
              className="w-full text-xs font-semibold p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Apartment">Apartment / Flat</option>
              <option value="Independent House">Independent House / Villa</option>
              <option value="High-Rise (Floor 6+)">High-Rise (Above Floor 6)</option>
              <option value="Ground Floor">Ground Floor / Basement Level</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Winter Heating Method
            </label>
            <select
              value={draft.heatingType}
              onChange={(e) => setDraft({ ...draft, heatingType: e.target.value as any })}
              className="w-full text-xs font-semibold p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Electric Heat Pump">Electric Heat Pump (Clean)</option>
              <option value="Radiator/Central">Radiator / Central Boiler</option>
              <option value="Gas Heater">Flued / Unflued Gas Heater</option>
              <option value="Biomass/Wood Stove">Biomass / Firewood Stove</option>
              <option value="None/Portable">None / Portable Electric</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Primary Commute Mode
            </label>
            <select
              value={draft.commuteMode}
              onChange={(e) => setDraft({ ...draft, commuteMode: e.target.value as any })}
              className="w-full text-xs font-semibold p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Electric Metro/Rail">Electric Metro / Rail (Lowest Exposure)</option>
              <option value="EV Car">Electric Car (Recirculation)</option>
              <option value="Bus/Public Transit">City Bus / Transit</option>
              <option value="Gas/Diesel Car">Petrol / Diesel ICE Car</option>
              <option value="Motorbike/Scooter">Motorbike / Scooter (High Exposure)</option>
              <option value="Bicycle/Walking">Bicycle / Walking</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Cooking Fuel
            </label>
            <select
              value={draft.cookingFuel}
              onChange={(e) => setDraft({ ...draft, cookingFuel: e.target.value as any })}
              className="w-full text-xs font-semibold p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Induction/Electric">Induction / Electric (Zero Flame)</option>
              <option value="Piped Natural Gas">Piped Natural Gas (PNG)</option>
              <option value="LPG Cylinder">LPG Cylinder</option>
              <option value="Biomass/Chulha">Biomass / Chulha (High Particulate)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};
