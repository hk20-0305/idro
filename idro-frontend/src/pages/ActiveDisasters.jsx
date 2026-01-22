import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { idroApi } from "../services/api"; // Import Real API
import { TriangleAlert, ArrowRight, Activity, MapPin, Calendar, Trash2 } from "lucide-react";

export default function ActiveDisasters() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const res = await idroApi.getAlerts();
      const active = res.data.filter(alert => alert.missionStatus === 'OPEN');
      const uniqueDisasters = removeDuplicates(active);
      setDisasters(uniqueDisasters);
    } catch (err) {
      console.error("Failed to fetch active disasters", err);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Stop click from opening the details page
    if (window.confirm("⚠️ Are you sure you want to DELETE this Disaster Alert? This cannot be undone.")) {
      try {
        await idroApi.deleteAlert(id);
        // Remove from UI immediately
        setDisasters(prev => prev.filter(d => d.id !== id));
      } catch (error) {
        alert("Failed to delete. Backend might be down.");
      }
    }
  };

  const removeDuplicates = (data) => {
    const uniqueMap = new Map();
    data.forEach(item => uniqueMap.set(item.location, item));
    return Array.from(uniqueMap.values());
  };

  const getCardStyle = (color) => {
    if (color === "RED") return "bg-red-950/40 border-red-500/50 hover:border-red-500 hover:bg-red-900/40";
    if (color === "ORANGE") return "bg-orange-950/40 border-orange-500/50 hover:border-orange-500 hover:bg-orange-900/40";
    return "bg-slate-800 border-white/10 hover:border-blue-500";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="p-3 bg-red-600 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
            <TriangleAlert size={32} className="text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-black tracking-wider uppercase">Active Disaster Feed</h1>
            <p className="text-slate-400 text-sm font-mono">LIVE DATA FROM IDRO SATELLITE NETWORK</p>
        </div>
      </div>

      {loading && (
          <div className="flex items-center gap-3 text-blue-400 animate-pulse">
              <Activity /> Establishing Secure Uplink...
          </div>
      )}

      {!loading && disasters.length === 0 && (
          <div className="text-slate-500 italic">No Active Disasters Detected. System Normal.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {disasters.map(d => (
          <div
            key={d.id}
            onClick={() => navigate(`/disaster/${d.id}`)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${getCardStyle(d.color)}`}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-4 -top-4 opacity-5 text-white transform rotate-12 group-hover:scale-110 transition-transform">
                <TriangleAlert size={150} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        d.color === "RED" ? "bg-red-600 text-white border-red-400" : "bg-orange-500 text-white border-orange-400"
                    }`}>
                        {d.color === "RED" ? "CRITICAL ALERT" : "WARNING"}
                    </span>
                    
                    {/* --- DELETE BUTTON --- */}
                    <button 
                        onClick={(e) => handleDelete(e, d.id)}
                        className="p-2 bg-black/40 hover:bg-red-600 rounded-lg text-slate-400 hover:text-white transition-all z-50 border border-white/10"
                        title="Delete Alert"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {d.type}
                </h2>
                
                <div className="flex items-center gap-2 text-slate-300 mb-4 text-sm font-medium">
                    <MapPin size={16} className="text-blue-500" /> {d.location}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 bg-black/20 p-4 rounded-lg border border-white/5">
                    <div>
                        <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">Severity</p>
                        <p className="text-sm font-bold text-white">{d.magnitude || "Assessing..."}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">Impact</p>
                        <p className="text-sm font-bold text-white truncate">{d.impact || "Calculating..."}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                     <span className="text-xs text-slate-500 font-mono">Source: {d.reporterLevel || "SATELLITE"}</span>
                     <div className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:text-white transition-colors uppercase tracking-widest">
                         View Tactical Report <ArrowRight size={14} />
                     </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}