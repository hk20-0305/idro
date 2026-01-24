import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { idroApi } from "../services/api";

export default function DisasterDetails2() {
  const { id } = useParams();

 const [disaster, setDisaster] = useState(null);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alertRes = await idroApi.getAlerts();
        const found = alertRes.data.find(a => String(a.id) === String(id));
        setDisaster(found);


        const campRes = await idroApi.getCamps();
        const related = campRes.data.filter(c => String(c.alertId) === String(id));
        setCamps(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const generateAiPlan = async () => {
  setAiLoading(true);

  try {
    const payload = {
      type: alert.type,
      location: alert.location,
      population: camps.reduce((sum, c) => sum + (c.population || 0), 0),
      camps
    };

    const res = await api.post("/ai/analyze", payload);

    const raw = res.data;

    const cleaned = raw
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    setAiData(parsed);

  } catch (err) {
    console.error(err);
    alert("AI parsing failed. Check console.");
  }

  setAiLoading(false);
};

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!alert) return <div className="p-10 text-red-400">Disaster not found</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-blue-400">
          {alert.type} – {alert.location}
        </h1>
        <p className="text-slate-400">
          Trust Score: {alert.trustScore} | Status: {alert.missionStatus}
        </p>
      </div>

      {/* CAMPS */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">
          Volunteer Camps ({camps.length})
        </h2>
        {camps.length === 0 && (
          <p className="text-slate-500">No camps linked yet.</p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={generateAiPlan}
        disabled={aiLoading}
        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-bold"
      >
        {aiLoading ? "Analyzing..." : "🤖 Generate AI Mission Plan"}
      </button>
{aiData && (
  <div className="mt-8 grid md:grid-cols-3 gap-6">

    {/* NEEDS */}
    <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10">
      <h2 className="text-lg font-bold text-red-400 mb-3">🚨 AI Needs</h2>
      <ul className="text-sm text-slate-300 space-y-2">
        {aiData.needs.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>

    {/* ALLOCATION */}
    <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10">
      <h2 className="text-lg font-bold text-yellow-400 mb-3">📦 AI Allocation</h2>
      <ul className="text-sm text-slate-300 space-y-2">
        {aiData.allocation.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>

    {/* EXECUTION */}
    <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10">
      <h2 className="text-lg font-bold text-green-400 mb-3">🚀 Execution Status</h2>
      <ul className="text-sm text-slate-300 space-y-2">
        {aiData.execution.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>

  </div>
)}

      {/* AI CARDS */}
      {aiData && (
        <div className="grid md:grid-cols-3 gap-6">

          {/* NEEDS */}
          <div className="bg-[#1e293b] p-6 rounded-xl border border-red-500/30">
            <h2 className="text-red-400 font-bold mb-3">🧠 AI Needs Analysis</h2>
            <ul className="text-sm text-slate-300 space-y-2">
              {aiData.needs.map((n, i) => <li key={i}>• {n}</li>)}
            </ul>
          </div>

          {/* ALLOCATION */}
          <div className="bg-[#1e293b] p-6 rounded-xl border border-yellow-500/30">
            <h2 className="text-yellow-400 font-bold mb-3">📦 AI Allocation Plan</h2>
            <ul className="text-sm text-slate-300 space-y-2">
              {aiData.allocation.map((a, i) => <li key={i}>• {a}</li>)}
            </ul>
          </div>

          {/* EXECUTION */}
          <div className="bg-[#1e293b] p-6 rounded-xl border border-green-500/30">
            <h2 className="text-green-400 font-bold mb-3">🚀 Execution Status</h2>
            <ul className="text-sm text-slate-300 space-y-2">
              {aiData.execution.map((e, i) => <li key={i}>• {e}</li>)}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
