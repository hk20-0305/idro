import { ArrowLeft, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { idroApi } from "../services/api";

export default function DisasterAnalyzer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [camps, setCamps] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const alertsRes = await idroApi.getAlerts();
      const found = alertsRes.data.find(d => String(d.id) === id);

      if (!found) throw new Error("Disaster not found");
      setDisaster(found);

      try {
        const impactRes = await idroApi.getImpactAnalysis(id);
        const analysis = impactRes.data;

        if (analysis) {
          // DIRECT MAPPING FROM BACKEND (ZERO LOGIC ON FRONTEND)
          const enrichedCamps = analysis.campAnalysisList.map(c => ({
            id: c.campId,
            name: c.campName,
            people: c.population,
            injured: c.injuredCount,
            foodPackets: c.foodPackets,
            waterLiters: c.waterLiters,
            beds: c.beds,
            medicalKits: c.medicalKits,
            volunteers: c.volunteers,
            ambulances: c.ambulances,
            riskLevel: c.riskLevel,
            urgency: c.urgency,
            saturation: Number(c.saturationPercentage) || 0,
            explanations: c.explanations || []
          }));

          setCamps(enrichedCamps);
        }
      } catch (aiErr) {
        console.warn("AI Analysis failed:", aiErr);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-mono tracking-widest text-blue-400">LOADING OPERATIONAL DATA...</p>
    </div>
  );

  if (error || !disaster) return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <XCircle size={48} className="text-red-500" />
      <p className="text-slate-400">{error || "Data Not Found"}</p>
      <button onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-800 rounded hover:bg-slate-700 transition text-sm">Return to Dashboard</button>
    </div>
  );

  const getUrgencyTheme = (urgency) => {
    switch (urgency?.toUpperCase()) {
      case "IMMEDIATE": return { bg: "bg-red-950/20", border: "border-red-500/30", strip: "bg-red-600", text: "text-red-500", glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]" };
      case "6 HOURS": return { bg: "bg-orange-950/20", border: "border-orange-500/30", strip: "bg-orange-600", text: "text-orange-500", glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]" };
      case "12 HOURS": return { bg: "bg-yellow-950/20", border: "border-yellow-500/30", strip: "bg-yellow-600", text: "text-yellow-500", glow: "shadow-[0_0_30px_rgba(234,179,8,0.15)]" };
      case "24 HOURS": return { bg: "bg-green-950/20", border: "border-green-500/30", strip: "bg-green-600", text: "text-green-500", glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]" };
      default: return { bg: "bg-slate-900", border: "border-slate-800", strip: "bg-slate-500", text: "text-slate-500", glow: "" };
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL": return "text-red-500";
      case "HIGH": return "text-orange-500";
      case "MEDIUM": return "text-yellow-500";
      case "LOW": return "text-green-500";
      default: return "text-slate-500";
    }
  };

  // Totals Section sums backend values directly
  const totals = {
    food: camps.reduce((sum, c) => sum + (c.foodPackets || 0), 0),
    water: camps.reduce((sum, c) => sum + (c.waterLiters || 0), 0),
    beds: camps.reduce((sum, c) => sum + (c.beds || 0), 0),
    medicalKits: camps.reduce((sum, c) => sum + (c.medicalKits || 0), 0),
    ambulances: camps.reduce((sum, c) => sum + (c.ambulances || 0), 0),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      {/* Premium Command Header */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 p-8 shadow-2xl">
        {/* Subtle Background Glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-all text-xs font-bold tracking-widest mb-4 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO MISSIONS
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
              {disaster.type} <span className="text-blue-500">/</span> {disaster.location}
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-slate-500 text-xs font-mono bg-slate-800/50 px-2 py-1 rounded">MISSION ID: {disaster.id}</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">SEVERITY: {disaster.magnitude}</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-1">Status</p>
              <p className="text-green-500 font-bold flex items-center gap-2 justify-end">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                LIVE COMMAND FEED
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <SummaryTile label="TOTAL FOOD PACKETS" value={totals.food} />
        <SummaryTile label="TOTAL WATER LITERS" value={totals.water} />
        <SummaryTile label="TOTAL BEDS" value={totals.beds} />
        <SummaryTile label="TOTAL MEDICAL KITS" value={totals.medicalKits} />
        <SummaryTile label="TOTAL AMBULANCES" value={totals.ambulances} />
      </div>

      {/* Camps Operational Data */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-400 tracking-widest uppercase mb-4">Camp-wise Operational Data</h2>

        <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {camps.map((camp) => {
            const theme = getUrgencyTheme(camp.urgency);
            return (
              <div key={camp.id} className={`${theme.bg} ${theme.border} border rounded-xl overflow-hidden flex shadow-lg hover:brightness-110 transition-all duration-300 ${theme.glow}`}>
                {/* Urgency Strip */}
                <div className={`w-2.5 ${theme.strip}`} />

                <div className="flex-1 p-6 space-y-6">
                  {/* Section 1: Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-white leading-tight mb-2 tracking-tight">{camp.name.toUpperCase()}</h3>
                      <div className="flex gap-6 text-slate-300 text-sm font-bold tracking-wide uppercase">
                        <span className="flex items-center gap-2"><span className="text-slate-500">PEOPLE:</span> {camp.people}</span>
                        <span className="flex items-center gap-2"><span className="text-slate-500">INJURED:</span> {camp.injured}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Urgency & Risk */}
                  <div className="flex items-center gap-8 border-y border-white/10 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 tracking-tight">OPERATIONAL WINDOW</span>
                      <span className={`px-2.5 py-1 rounded text-[11px] font-black text-white ${theme.strip}`}>
                        {camp.urgency?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 tracking-tight">CALCULATED RISK</span>
                      <span className={`text-base font-black ${getRiskColor(camp.riskLevel)}`}>
                        {camp.riskLevel || "LOW"}
                      </span>
                    </div>
                  </div>

                  {/* Supply Saturation Gauge (Consumption Progress) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SUPPLY SATURATION</span>
                      <span className="text-xs font-black text-green-500">
                        {Math.max(0, Math.min(100, Math.round(camp.saturation || 0)))}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-red-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-1000"
                        style={{ width: `${Math.max(0, Math.min(100, camp.saturation || 0))}%` }}
                      />
                    </div>
                  </div>

                  {/* Section 3: Resources Grid */}
                  <div className="grid grid-cols-3 gap-y-7 gap-x-4">
                    <ResourceItem label="FOOD PACKETS" value={camp.foodPackets} />
                    <ResourceItem label="WATER LITERS" value={camp.waterLiters} />
                    <ResourceItem label="BEDS" value={camp.beds} />
                    <ResourceItem label="MEDICAL KITS" value={camp.medicalKits} />
                    <ResourceItem label="VOLUNTEERS" value={camp.volunteers} />
                    <ResourceItem label="AMBULANCES" value={camp.ambulances} />
                  </div>

                  {/* Section 4: Operational Alerts */}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-500 font-bold uppercase block mb-3 tracking-widest">COMMAND ALERTS</span>
                    <div className="space-y-2.5">
                      {camp.explanations.length > 0 ? (
                        camp.explanations.map((ex, i) => (
                          <div key={i} className="flex gap-3 items-start text-xs text-slate-200">
                            <span className={`${theme.text} mt-0.5 text-lg leading-none`}>•</span>
                            <span className="leading-relaxed font-medium">{ex}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No automated alerts triggered</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
      <p className="text-[10px] text-slate-500 font-black tracking-widest mb-1.5 uppercase leading-none">{label}</p>
      <p className="text-3xl font-black text-white leading-none tracking-tighter">{value?.toLocaleString() || 0}</p>
    </div>
  );
}

function ResourceItem({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-slate-500 font-bold tracking-tight uppercase leading-none">{label}</p>
      <p className="text-xl font-black text-slate-100 leading-none">{value ?? 0}</p>
    </div>
  );
}