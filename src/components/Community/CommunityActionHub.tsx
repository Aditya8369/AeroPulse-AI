import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ThumbsUp, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin,
  X,
  Check
} from 'lucide-react';
import { CommunityPledge, CommunityReport, CommunityReportType } from '../../types/impact';
import { INITIAL_COMMUNITY_PLEDGES, INITIAL_COMMUNITY_REPORTS } from '../../data/communityPledges';
import { CityAirData } from '../../types/aqi';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage';
import { sanitizeUserInput } from '../../utils/sanitize';
import { announceToScreenReader } from '../../utils/a11y';

interface CommunityActionHubProps {
  cityData: CityAirData;
}

const REPORT_TYPE_OPTIONS: readonly { value: CommunityReportType; label: string }[] = [
  { value: 'Open Biomass/Stubble Burning', label: 'Open Biomass or Leaf Pile Burning' },
  { value: 'Municipal Waste Incineration', label: 'Municipal Garbage / Plastic Waste Burning' },
  { value: 'Construction Dust Plume', label: 'Uncovered Construction & Demolition Dust' },
  { value: 'Industrial Smoke', label: 'Illegal Dark Industrial Smoke' },
  { value: 'Idling Heavy Vehicles', label: 'Commercial Heavy Vehicle Idling Cluster' },
] as const;

export const CommunityActionHub: React.FC<CommunityActionHubProps> = ({ cityData }) => {
  const [pledges, setPledges] = useState<CommunityPledge[]>(() => 
    safeLocalStorageGet('aeropulse_pledges', INITIAL_COMMUNITY_PLEDGES)
  );

  const [reports, setReports] = useState<CommunityReport[]>(() =>
    safeLocalStorageGet('aeropulse_reports', INITIAL_COMMUNITY_REPORTS)
  );

  const [supportedPledges, setSupportedPledges] = useState<Record<string, boolean>>({});
  const [upvotedReports, setUpvotedReports] = useState<Record<string, boolean>>({});
  const [showReportModal, setShowReportModal] = useState(false);

  // New report form state
  const [newType, setNewType] = useState<CommunityReportType>('Open Biomass/Stubble Burning');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (!showReportModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowReportModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showReportModal]);

  const handleTogglePledge = (pledgeId: string) => {
    const isSupported = !!supportedPledges[pledgeId];
    const updated = pledges.map(p => {
      if (p.id === pledgeId) {
        return {
          ...p,
          supportersCount: isSupported ? p.supportersCount - 1 : p.supportersCount + 1
        };
      }
      return p;
    });

    setPledges(updated);
    setSupportedPledges(prev => ({ ...prev, [pledgeId]: !isSupported }));
    safeLocalStorageSet('aeropulse_pledges', updated);
    announceToScreenReader(isSupported ? 'Withdrew support from pledge.' : 'Joined community pledge.');
  };

  const handleUpvoteReport = (reportId: string) => {
    const isUpvoted = !!upvotedReports[reportId];
    const updated = reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          upvotes: isUpvoted ? r.upvotes - 1 : r.upvotes + 1
        };
      }
      return r;
    });

    setReports(updated);
    setUpvotedReports(prev => ({ ...prev, [reportId]: !isUpvoted }));
    safeLocalStorageSet('aeropulse_reports', updated);
    announceToScreenReader(isUpvoted ? 'Removed verification vote.' : 'Verified community smoke report.');
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLocation = sanitizeUserInput(newLocation, 200);
    const cleanNotes = sanitizeUserInput(newNotes, 1000);

    if (!cleanLocation) return;

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      type: newType,
      locationDescription: cleanLocation,
      notes: cleanNotes || 'Reported by local neighborhood resident.',
      timestamp: 'Just now',
      status: 'Reported to Municipality',
      upvotes: 1
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    safeLocalStorageSet('aeropulse_reports', updated);
    setShowReportModal(false);
    setNewLocation('');
    setNewNotes('');
    announceToScreenReader(`Smoke report for ${cleanLocation} submitted and dispatched to municipal control.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
            Collective Smog Defense
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Community Clean Air Network — {cityData.cityName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Air is a shared commons. Coordinate neighborhood smoke patrol, report illegal waste incineration, and join collective low-emission commitments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <Flame className="w-4 h-4" aria-hidden="true" />
          <span>Report Smoke or Dust Plume</span>
        </button>
      </div>

      {/* Two columns: Pledges & Smoke Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Community Pledges (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              Neighborhood Action Pledges
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {pledges.length} Active Campaigns
            </span>
          </div>

          <div className="space-y-3">
            {pledges.map((pledge) => {
              const isSupported = !!supportedPledges[pledge.id];
              return (
                <div
                  key={pledge.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                        {pledge.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                        {pledge.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePledge(pledge.id)}
                      aria-pressed={isSupported}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isSupported
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isSupported ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Pledged</span>
                        </>
                      ) : (
                        <span>Join Pledge</span>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {pledge.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      👥 {pledge.supportersCount} Residents Committed
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      -{pledge.estimatedCommunityPM25ReductionKgPerWeek} kg PM2.5/wk
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smoke & Burning Patrol (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
              Live Smoke & Pollution Reports
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Verified by Neighborhoods
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => {
              const isUpvoted = !!upvotedReports[report.id];
              return (
                <div
                  key={report.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          {report.type}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {report.timestamp}
                        </span>
                      </div>

                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>{report.locationDescription}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                    {report.notes}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleUpvoteReport(report.id)}
                      aria-pressed={isUpvoted}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        isUpvoted
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{report.upvotes} Verified by Neighbors</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Dispatched to municipal control room
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Report Plume Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" aria-hidden="true" />
                <h3 id="report-modal-title" className="font-bold text-base text-slate-900 dark:text-white">
                  Report Illegal Burning or Dust Incident
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                aria-label="Close report dialog"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label htmlFor="report-type-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Incident Category
                </label>
                <select
                  id="report-type-select"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CommunityReportType)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {REPORT_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="report-location-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Exact Landmark / Location in {cityData.cityName}
                </label>
                <input
                  id="report-location-input"
                  type="text"
                  required
                  placeholder="e.g., Near Sector 14 market gate 2, vacant corner plot"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label htmlFor="report-notes-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Additional Notes (Visible smoke density, nearby schools/hospitals)
                </label>
                <textarea
                  id="report-notes-input"
                  rows={3}
                  placeholder="e.g., Thick black plastic smoke drifting toward primary school."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Submit Community Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
