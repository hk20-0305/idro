import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { idroApi } from "../services/api"; // Import Real API
import { Activity, ArrowRight, BarChart3, AlertTriangle, XCircle } from "lucide-react";

export default function ImpactList() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ NEW: Track Errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        setLoading(true);
        // 1. Fetch Real Data from Backend
        const res = await idroApi.getAlerts();
        
        // 2. Filter for OPEN missions only
        const active = res.data.filter(d => d.missionStatus === 'OPEN');
        setDisasters(active);
        setError(null); // Clear errors on success
      } catch (err) {
        console.error("Failed to load impact list", err);
        setError("⚠ UNABLE TO CONNECT TO SERVER. Is Backend Running?"); // ✅ Set Error Message
      } finally {
        setLoading(false); // ✅ This ensures loading always stops
      }
    };
    fetchDisasters();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50">
             <BarChart3 size={32} className="text-white" />
          </div>
          <div>
             <h1 className="text-3xl font-black tracking-wider uppercase">Predictive Impact Analytics</h1>
             <p className="text-slate-400 text-sm font-mono">SELECT A DISASTER TO RUN AI RESOURCE MODELING</p>
          </div>
        </div>

        {/* ✅ NEW: Error Message Display */}
        {error && (
            <div className="bg-red-900/50 border border-red-500 p-4 rounded-xl text-red-200 flex items-center gap-3 mb-6 animate-pulse">
                <XCircle size={24} />
                <span className="font-bold">{error}</span>
            </div>
        )}

        {/* Loading State */}
        {loading && (
             <div className="flex items-center gap-3 text-blue-400 animate-pulse">
                <Activity /> Syncing with Satellite Database...
             </div>
        )}

        {/* Empty State (Only show if NOT loading and NO error) */}
        {!loading && !error && disasters.length === 0 && (
             <div className="text-slate-500 italic">No Active Threats Requiring Analysis.</div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disasters.map((disaster) => (
            <div 
              key={disaster.id}
              onClick={() => navigate(`/impact-analysis/${disaster.id}`)}
              className="group cursor-pointer bg-[#1e293b] hover:bg-[#263345] border border-white/5 hover:border-blue-500/50 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <AlertTriangle size={100} />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                       disaster.color === 'RED' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                   }`}>
                     {disaster.type}
                   </span>
                   <span className="text-xs text-slate-500 font-mono">{disaster.time || "LIVE"}</span>
                </div>

                <div>
                   <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                     {disaster.location}
                   </h2>
                   <p className="text-sm text-slate-400 mt-1 line-clamp-1">{disaster.impact}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-black/20 p-2 rounded">
                        <p className="text-[10px] text-slate-500 uppercase">Affected</p>
                        <p className="font-mono text-white">{disaster.affectedCount}</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                        <p className="text-[10px] text-slate-500 uppercase">Injured</p>
                        <p className="font-mono text-white">{disaster.injuredCount}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mt-2 group-hover:translate-x-2 transition-transform">
                   Generate Report <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}