import { AlertTriangle, ArrowLeft, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { idroApi } from "../services/api"; // Import Real API

export default function DisasterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA FROM BACKEND BY ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // We use getAlerts() and find the specific one.
        // Ideally, you'd make a specific endpoint like idroApi.getAlertById(id),
        // but fetching all works for now since the list is small.
        const res = await idroApi.getAlerts();
        const found = res.data.find(d => d.id === id);
        setDisaster(found);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center animate-pulse">📡 Fetching Satellite Data...</div>;

  if (!disaster) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">❌ Disaster Not Found in Database.</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10 font-sans">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto bg-[#1e293b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-8">

        {/* HEADER */}
        <div className="border-b border-white/10 pb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black tracking-wide text-white mb-2">{disaster.type}</h1>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
                        <MapPin size={20}/> {disaster.location}
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-sm tracking-widest border ${
                    disaster.color === "RED" ? "bg-red-600/20 text-red-400 border-red-500" : "bg-orange-500/20 text-orange-400 border-orange-500"
                }`}>
                    {disaster.color === "RED" ? "CRITICAL ALERT" : "WARNING"}
                </div>
            </div>
        </div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard label="Severity" value={disaster.magnitude} icon={<AlertTriangle size={16}/>} />
          <InfoCard label="Reporter" value={disaster.reporterLevel} />
          <InfoCard label="People Affected" value={disaster.affectedCount} icon={<Users size={16}/>} />
          <InfoCard label="Injured" value={disaster.injuredCount} />
        </div>

        {/* DETAILS & IMPACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="🚨 Impact & Details">
                <p className="text-slate-300 leading-relaxed text-sm bg-black/30 p-4 rounded-lg border border-white/5">
                    {disaster.details || "No ground details available yet."}
                </p>
            </Section>

            <Section title="📉 Infrastructure Damage">
                 <p className="text-slate-300 leading-relaxed text-sm bg-black/30 p-4 rounded-lg border border-white/5">
                    {disaster.impact || "Assessing..."}
                </p>
            </Section>
        </div>

        {/* VERIFICATION */}
        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 flex justify-between items-center">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Data Source</span>
            <span className="font-mono text-sm text-white">{disaster.sourceType}</span>
        </div>

      </div>
    </div>
  );
}

// Reusable Small Components
const InfoCard = ({ label, value, icon }) => (
  <div className="bg-[#0f172a] p-4 rounded-xl border border-white/10 flex flex-col justify-center">
    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">{icon} {label}</p>
    <p className="font-bold text-lg text-white">{value || "—"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">{title}</h2>
    {children}
  </div>
);