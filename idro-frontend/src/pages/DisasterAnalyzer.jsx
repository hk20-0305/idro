import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { idroApi } from "../services/api"; // ✅ Import Real API
import { ArrowLeft, Cpu, XCircle } from "lucide-react"; // Added missing icons for loading/error states

export default function DisasterAnalyzer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Alert Details
        const alertsRes = await idroApi.getAlerts();
        const found = alertsRes.data.find(d => String(d.id) === id);
        
        if (!found) throw new Error("Disaster not found");
        setDisaster(found);

        // 2. Fetch AI Impact Data
        const impactRes = await idroApi.getImpact(found.id);
        setImpactData(impactRes.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load analysis. Check Backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4 animate-pulse">
        <Cpu size={48} className="text-blue-500 animate-spin" />
        <p className="text-xl font-mono text-blue-300">IDRO AI IS GENERATING LOGISTICS MODEL...</p>
    </div>
  );

  // --- ERROR STATE ---
  if (error || !disaster) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
        <XCircle size={64} className="text-red-500" />
        <p className="text-slate-400">{error || "Data Not Found"}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500">Back</button>
    </div>
  );

  // ✅ Maps Backend Data to your UI Format
  // Note: Since 'camps' aren't fully structured in the backend DB yet, we default to []
  // But we use the REAL Backend AI totals for the summary.
  const camps = []; 

  // AI calculations (Preserved your logic for camps, though array is empty for now)
  const campAnalysis = camps.map(camp => {
    const people = Number(camp.people || 0);
    const capacity = Number(camp.capacity || 0);

    return {
      ...camp,
      food: people * 3,
      water: people * 4,
      doctors: Math.ceil(people / 200),
      ambulances: Math.ceil(people / 150),
      critical: capacity > 0 && people > capacity * 0.9
    };
  });

  // ✅ USE REAL BACKEND AI VALUES FOR TOTALS
  const totalFood = impactData ? impactData.foodPerDay : 0;
  const totalWater = impactData ? impactData.waterPerDay : 0;
  const totalAmb = impactData ? impactData.ambulances : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10 space-y-10 font-sans">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
        <ArrowLeft size={18} /> Back
      </button>

      {/* ============ HEADER ============ */}
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-wider text-blue-400">
          {disaster.type} — {disaster.location}
        </h1>
        <p className="text-slate-400 mt-1">
          Severity: {disaster.magnitude} | Mission Status: {disaster.missionStatus}
        </p>
      </div>

      {/* ============ OVERVIEW ============ */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10">
        <h2 className="font-bold mb-4 text-lg">Disaster Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Stat label="Affected" value={disaster.affectedCount} />
          <Stat label="Injured" value={disaster.injuredCount} />
          {/* Using Impact text for 'Missing' since it's unstructured */}
          <Stat label="Impact Notes" value={disaster.impact ? disaster.impact.substring(0, 15) + "..." : "N/A"} />
          <Stat label="Active Resources" value={impactData ? impactData.medicalTeams + " Teams" : "0"} />
        </div>
      </div>

      {/* ============ CAMPS GRID ============ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Camp-wise AI Analysis</h2>

        {/* Note: This grid will be empty until we add Camp Table to DB, but structure is preserved */}
        {campAnalysis.length === 0 && (
            <div className="p-10 border border-dashed border-white/10 rounded-xl text-center text-slate-500">
                No individual camp data uplinked yet. Using Satellite Aggregates below.
            </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campAnalysis.map((camp, i) => (
            <div
              key={i}
              className={`rounded-xl border p-6 space-y-4 ${
                camp.critical
                  ? "bg-red-950/30 border-red-500"
                  : "bg-[#1e293b] border-white/10"
              }`}
            >
              {/* Camp Header */}
              <div>
                <h3 className="text-lg font-bold">{camp.name}</h3>
                <p className="text-xs text-slate-400">{camp.location}</p>
              </div>

              {/* Camp Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="People" value={`${camp.people}/${camp.capacity}`} />
                <Stat label="Doctors" value={camp.doctors} />
                <Stat label="Ambulances" value={camp.ambulances} />
                <Stat label="Food/day" value={camp.food} />
                <Stat label="Water/day" value={`${camp.water} L`} />
              </div>

              {/* Requirements */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Camp Requirements</p>
                <div className="flex flex-wrap gap-2">
                  {camp.needs.map((n, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs bg-blue-900/40 border border-blue-500/30 rounded-full"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {camp.critical && (
                <p className="text-red-400 font-bold text-xs">
                  ⚠ Overcrowded – Priority Deployment Needed
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ AI SUMMARY ============ */}
      {/* ✅ THIS NOW SHOWS REAL BACKEND CALCULATIONS */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10 space-y-2">
        <h2 className="font-bold text-lg text-blue-400 uppercase tracking-widest mb-4">AI Aggregated Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                <span>Total Food/day:</span>
                <b className="text-xl">{totalFood} <span className="text-xs font-normal">meals</span></b>
             </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                <span>Total Water/day:</span>
                <b className="text-xl">{totalWater} <span className="text-xs font-normal">L</span></b>
             </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                <span>Ambulances:</span>
                <b className="text-xl">{totalAmb}</b>
             </div>
             {/* Showing Extra AI Data if available */}
             {impactData && impactData.shelterShortfall > 0 && (
                 <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 flex justify-between items-center text-purple-300">
                    <span>Shelter Shortfall:</span>
                    <b className="text-xl">{impactData.shelterShortfall}</b>
                 </div>
             )}
        </div>
      </div>

      {/* ============ AI RECOMMENDATIONS ============ */}
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-xl border border-blue-500/30">
        <h2 className="font-bold mb-3 flex items-center gap-2">🤖 AI Strategic Recommendations</h2>
        <ul className="list-disc ml-6 text-sm text-slate-300 space-y-2">
          {impactData && impactData.rescueBoats > 0 && (
             <li className="text-yellow-400 font-bold">Deploy {impactData.rescueBoats} Rescue Boats immediately to flood zones.</li>
          )}
          <li>Deploy resources first to high density zones.</li>
          <li>Prioritize medical units ({impactData?.medicalTeams || 0} teams needed) for injured population.</li>
          <li>Increase supply rotation frequency in critical zones.</li>
          <li>Monitor satellite feed every 4 hours for changes.</li>
        </ul>
      </div>
    </div>
  );
}

/* ============ SMALL REUSABLE COMPONENTS ============ */
function Stat({ label, value }) {
  return (
    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-bold text-white text-lg truncate">{value}</p>
    </div>
  );
}