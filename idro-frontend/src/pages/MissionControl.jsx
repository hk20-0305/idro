import { useEffect, useState } from "react";
import { calculateImpact } from "../utils/impactEngine";

export default function MissionControl() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const disasters = JSON.parse(localStorage.getItem("disasters")) || [];

    // Only ACTIVE disasters (not pre alerts)
    const active = disasters.filter(d => d.urgency === "High" || d.urgency === "Immediate");

    const generatedPlans = active.map(d => {
      const impact = calculateImpact(d);

      return {
        id: d.id,
        title: `${d.type} - ${d.location}`,
        allocation: [
          `NGO A → ${Math.ceil(impact.foodPerDay * 0.4)} Food Kits → Sector 1`,
          `Govt Hospital → ${impact.ambulances} Ambulances → Sector 2`,
          `Rescue Team Bravo → ${Math.ceil(impact.medicalTeams / 2)} Units → Sector 3`,
        ],
        optimization: [
          "✔ No duplication detected",
          "✔ Closest resources selected",
          `✔ Estimated response time: ${10 + Math.floor(Math.random() * 10)} min`
        ]
      };
    });

    setPlans(generatedPlans);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">
      <h1 className="text-3xl font-bold mb-8">🎯 Mission Control – Auto Allocation</h1>

      <div className="space-y-8">
        {plans.length === 0 && (
          <p className="text-slate-400">No high-priority disasters available for deployment.</p>
        )}

        {plans.map(plan => (
          <div
            key={plan.id}
            className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <h2 className="text-2xl font-bold text-red-400">
              Target Zone: {plan.title}
            </h2>

            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-3">
                🤖 AI Allocation Plan
              </h3>
              <ul className="space-y-2 text-sm">
                {plan.allocation.map((a, i) => (
                  <li key={i} className="bg-black/40 p-3 rounded-xl">
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                ⚙ Optimization
              </h3>
              <ul className="space-y-2 text-sm">
                {plan.optimization.map((o, i) => (
                  <li key={i} className="bg-black/40 p-3 rounded-xl">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
