import React, { useState } from 'react';
import { 
  Flame, 
  ThumbsUp, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin 
} from 'lucide-react';
import { CommunityPledge, CommunityReport } from '../../types/impact';
import { INITIAL_COMMUNITY_PLEDGES, INITIAL_COMMUNITY_REPORTS } from '../../data/communityPledges';
import { CityAirData } from '../../types/aqi';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage';

interface CommunityActionHubProps {
  cityData: CityAirData;
}

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
  const [newType, setNewType] = useState<CommunityReport['type']>('Open Biomass/Stubble Burning');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');

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
    setSupportedPledges({ ...supportedPledges, [pledgeId]: !isSupported });
    safeLocalStorageSet('aeropulse_pledges', updated);
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
    setUpvotedReports({ ...upvotedReports, [reportId]: !isUpvoted });
    safeLocalStorageSet('aeropulse_reports', updated);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      type: newType,
      locationDescription: newLocation.trim(),
      notes: newNotes.trim() || 'Reported by local neighborhood resident.',
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
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Flame className="w-4 h-4" />
          <span>Report Smoke or Dust Plume</span>
        </button>
      </div>

      {/* Two columns: Pledges & Smoke Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Collective Pledges (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Community Action Pledges
            </h3>
            <span className="text-xs text-slate-500">Tap to Sign Pledge</span>
          </div>

          <div className="space-y-3">
            {pledges.map((pledge) => {
              const isSupported = !!supportedPledges[pledge.id];
              return (
                <div
                  key={pledge.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSupported
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {pledge.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {pledge.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {pledge.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          👥 {pledge.supportersCount.toLocaleString()} Pledged
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          ~{pledge.estimatedCommunityPM25ReductionKgPerWeek} kg PM2.5/wk cut
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTogglePledge(pledge.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        isSupported
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isSupported ? '✓ Pledged' : 'Join Pledge'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-Time Smoke & Plume Reports (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Community Ground Reports
            </h3>
            <span className="text-xs text-slate-500">Live neighborhood vigilance</span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => {
              const isUpvoted = !!upvotedReports[report.id];
              return (
                <div
                  key={report.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
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
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                      onClick={() => handleUpvoteReport(report.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        isUpvoted
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Report Ground Smog / Waste Fire
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Violation / Incident Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs font-semibold p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Open Biomass/Stubble Burning">Open Biomass / Leaf / Wood Burning</option>
                  <option value="Construction Dust Plume">Uncovered Construction Dust Plume</option>
                  <option value="Garbage Incineration">Plastic & Garbage Incineration</option>
                  <option value="Industrial Smoke">Illegal Dark Industrial Smoke</option>
                  <option value="Idling Heavy Vehicles">Commercial Heavy Vehicle Idling Cluster</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Exact Landmark / Location in {cityData.cityName}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Near Sector 14 market gate 2, vacant corner plot"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Additional Notes (Visible smoke density, nearby schools/hospitals)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Thick black plastic smoke drifting toward primary school."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
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
