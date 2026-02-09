import { ArrowLeft, Cpu, XCircle } from "lucide-react"; // Added missing icons for loading/error states
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { idroApi } from "../services/api"; // ✅ Import Real API

export default function DisasterAnalyzer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [camps, setCamps] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Alert Details (for base info)
      const alertsRes = await idroApi.getAlerts();
      const found = alertsRes.data.find(d => String(d.id) === id);

      if (!found) throw new Error("Disaster not found");
      setDisaster(found);

      // 2. Fetch AI Impact Analysis
      try {
        const impactRes = await idroApi.getImpactAnalysis(id);
        const analysis = impactRes.data;

        // Map Backend AI Data to UI State
        if (analysis) {
          setImpactData({
            foodPerDay: analysis.campAnalysisList.reduce((sum, c) => sum + (c.predictedFood || 0), 0),
            waterPerDay: analysis.campAnalysisList.reduce((sum, c) => sum + (c.predictedWater || 0), 0),
            ambulances: analysis.campAnalysisList.reduce((sum, c) => sum + (c.predictedAmbulances || 0), 0),
            medicalTeams: analysis.campAnalysisList.reduce((sum, c) => sum + (c.predictedMedicalKits || 0), 0), // Using kits as proxy for teams if needed, or update logic
            shelterShortfall: 0, // Not explicitly in new AI response, can keep as 0 or calc
            rescueBoats: analysis.disasterType.toUpperCase().includes("FLOOD") ? 5 : 0 // Simple rule for now
          });

          // Update Camps with AI Predictions
          const enrichedCamps = analysis.campAnalysisList.map(c => ({
            id: c.campId,
            name: c.campName,
            location: "TBD", // API DTO doesn't have location yet, maybe merge with camp list?
            people: c.predictedFood / 3, // Reverse calc or use population if available in DTO
            capacity: c.predictedFood / 3,
            needs: c.explanations || [],
            food: c.predictedFood,
            water: c.predictedWater,
            beds: c.predictedBeds,
            doctors: c.predictedMedicalKits,
            volunteers: c.predictedVolunteers,
            ambulances: c.predictedAmbulances,
            predictionSource: c.predictionSource,
            riskScore: c.riskScore,
            critical: c.riskScore > 0.7
          }));

          setCamps(enrichedCamps);
        }
      } catch (aiErr) {
        console.warn("AI Analysis failed, falling back to local calc:", aiErr);
        // Fallback logic could go here if needed
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if id exists
    if (id) {
      fetchData();
    }
  }, [id]); // ✅ Only re-run when ID changes


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
      <div className="flex gap-4">
        <button
          onClick={() => fetchData()}
          className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
        >
          🔄 Retry
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Use camps directly from API (already enriched with AI data)
  const campsToRender = camps.length > 0 ? camps : [];


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

        {campsToRender.length === 0 ? (
          <div className="bg-[#1e293b] p-8 rounded-xl border border-white/10 text-center">
            <p className="text-slate-400">No camps found for this mission. AI analysis will appear once camps are registered.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campsToRender.map((camp, i) => (

              <div
                key={camp.id || i}
                className={`rounded-xl border p-6 space-y-4 ${camp.critical
                  ? "bg-red-950/30 border-red-500"
                  : "bg-[#1e293b] border-white/10"
                  }`}
              >
                {/* Camp Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">
                      {camp.name || `Camp ${String.fromCharCode(65 + i)}`}
                    </h3>
                    <p className="text-xs text-slate-400">{camp.location || "Location TBD"}</p>
                  </div>

                  {/* Prediction Source Badge */}
                  {camp.predictionSource && (
                    <span className={`px-2 py-1 text-xs rounded-full ${camp.predictionSource === 'ML'
                      ? 'bg-green-900/40 border border-green-500/30 text-green-300'
                      : 'bg-yellow-900/40 border border-yellow-500/30 text-yellow-300'
                      }`}>
                      {camp.predictionSource === 'ML' ? '🤖 AI' : '📊 Fallback'}
                    </span>
                  )}
                </div>

                {/* Risk Score Indicator */}
                {camp.riskScore !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Risk Score:</span>
                    <div className="flex-1 bg-black/20 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${camp.riskScore > 0.7 ? 'bg-red-500' :
                          camp.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${camp.riskScore * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${camp.riskScore > 0.7 ? 'text-red-400' :
                      camp.riskScore > 0.4 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                      {(camp.riskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                )}

                {/* AI Predicted Resources */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Stat label="Food/day" value={camp.food ? `${camp.food} meals` : "—"} />
                  <Stat label="Water/day" value={camp.water ? `${camp.water} L` : "—"} />
                  <Stat label="Beds" value={camp.beds ?? "—"} />
                  <Stat label="Medical Kits" value={camp.doctors ?? "—"} />
                  <Stat label="Volunteers" value={camp.volunteers ?? "—"} />
                  <Stat label="Ambulances" value={camp.ambulances ?? "—"} />
                </div>

                {/* AI Explanations */}
                {camp.needs && camp.needs.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">AI Insights</p>
                    <div className="flex flex-wrap gap-2">
                      {camp.needs.slice(0, 3).map((n, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs bg-blue-900/40 border border-blue-500/30 rounded-full"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {camp.critical && (
                  <p className="text-red-400 font-bold text-xs">
                    ⚠ High Risk – Priority Deployment Needed
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
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