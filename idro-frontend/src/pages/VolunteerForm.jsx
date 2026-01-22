import { useState, useEffect } from "react";
import { idroApi } from "../services/api"; // Import the real API

export default function VolunteerForm() {
  // 1. Store the list of Active Satellite Alerts for the Dropdown
  const [activeAlerts, setActiveAlerts] = useState([]);
  
  // NEW: Store the ID of the selected alert to UPDATE it instead of creating a new one
  const [selectedAlertId, setSelectedAlertId] = useState(null); 

  const [form, setForm] = useState({
    location: "",      
    type: "",          // Now auto-selected!
    severity: "",
    urgency: "",
    affectedCount: "", 
    injuredCount: "",  
    missing: "",
    verifiedBy: "",
    infra: [],         
    needs: []          
  });

  const [camps, setCamps] = useState([]);

  // 2. Options Lists (Preserved)
  const infraOptions = [
    "Roads Blocked",
    "Bridge Collapse",
    "Power Failure",
    "Water Failure",
    "Mobile Network Down"
  ];

  const needsOptions = [
    "Food",
    "Water",
    "Medicines",
    "Shelter",
    "Ambulance",
    "NDRF",
    "Evacuation",
    "Helicopter"
  ];

  const campNeeds = [
    "Food",
    "Water",
    "Medicines",
    "Beds",
    "Blankets",
    "Electricity",
    "Toilets",
    "Ambulance",
    "Volunteers"
  ];

  // 3. ON LOAD: Fetch Real-Time Satellite Data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await idroApi.getAlerts();
        const openAlerts = response.data.filter(a => a.missionStatus === 'OPEN');
        setActiveAlerts(openAlerts);
      } catch (error) {
        console.error("Failed to load satellite data", error);
      }
    };
    fetchLocations();
  }, []);

  // --- NEW: AUTO-SELECT DISASTER TYPE & CAPTURE ID LOGIC ---
  const handleLocationChange = (e) => {
    const selectedLoc = e.target.value;
    
    // Find the alert object that matches the selected location
    const matchedAlert = activeAlerts.find(alert => alert.location === selectedLoc);

    setForm(prev => ({
      ...prev,
      location: selectedLoc,
      // If a match is found, auto-select the Type. Otherwise, reset Type.
      type: matchedAlert ? matchedAlert.type : "" 
    }));

    // NEW: Capture the ID so we update the existing record
    if (matchedAlert) {
        setSelectedAlertId(matchedAlert.id);
    } else {
        setSelectedAlertId(null);
    }
  };
  // --------------------------------------------

  const toggleArrayValue = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const addCamp = () => {
    setCamps([...camps, { name: "", location: "", capacity: "", people: "", needs: [] }]);
  };

  const updateCamp = (index, field, value) => {
    const updated = [...camps];
    updated[index][field] = value;
    setCamps(updated);
  };

  const toggleCampNeed = (index, need) => {
    const updated = [...camps];
    updated[index].needs = updated[index].needs.includes(need)
      ? updated[index].needs.filter(n => n !== need)
      : [...updated[index].needs, need];
    setCamps(updated);
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      id: selectedAlertId, // <--- CRITICAL: Sends the ID so Backend performs UPDATE
      details: `Infra: ${form.infra.join(', ')}. Needs: ${form.needs.join(', ')}. Verified by: ${form.verifiedBy}`,
      impact: `Camps Active: ${camps.length}. Missing: ${form.missing}`,
      reporterLevel: "VOLUNTEER",
      sourceType: "VOLUNTEER-APP",
      missionStatus: "OPEN",
      time: new Date().toLocaleTimeString()
    };

    try {
      await idroApi.submitReport(payload);
      alert("✅ Verified Intelligence Sent to Command Center!");
      
      // Reset Form
      setForm({
        location: "",
        type: "",
        severity: "",
        urgency: "",
        affectedCount: "",
        injuredCount: "",
        missing: "",
        verifiedBy: "",
        infra: [],
        needs: []
      });
      setCamps([]);
      setSelectedAlertId(null); // Reset ID
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ Submission Failed. Is the Backend Running?");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <form onSubmit={submit} className="max-w-6xl mx-auto bg-[#1e293b] p-10 rounded-2xl space-y-10 border border-white/10 shadow-2xl">

        <h1 className="text-3xl font-black text-center tracking-wider text-blue-400">VOLUNTEER INTELLIGENCE UPLINK</h1>

        {/* --- DISASTER INFO --- */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">📍 Location & Casualty Report</h2>

          {/* 1. AUTO-LOCATION DROPDOWN (Now triggers Auto-Type) */}
          <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
            <label className="block text-blue-400 font-bold mb-2 uppercase text-xs tracking-widest">
              Select Active Satellite Alert
            </label>
            <select 
              value={form.location} 
              onChange={handleLocationChange} // Using the new handler here
              className="w-full bg-[#0f172a] text-white p-4 rounded-xl border border-white/10 focus:border-blue-500 outline-none cursor-pointer"
              required
            >
              <option value="">-- Select Detected Zone --</option>
              {activeAlerts.map(alert => (
                <option key={alert.id} value={alert.location}>
                   [LIVE] {alert.type} - {alert.location}
                </option>
              ))}
              <option value="New Location">-- Report New Location --</option>
            </select>
            <p className="text-[10px] text-slate-500 mt-2 italic">* Disaster Type will be auto-detected based on selection.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* 2. DISASTER TYPE (Now Auto-Filled) */}
            <select 
                value={form.type} 
                onChange={e => setForm({ ...form, type: e.target.value })} 
                className="bg-black/30 p-3 rounded-xl border border-white/5 font-bold text-blue-200"
            >
              <option value="">Disaster Type (Auto)</option>
              <option>FLOOD</option>
              <option>CYCLONE</option>
              <option>EARTHQUAKE</option>
              <option>LANDSLIDE</option>
              <option>FIRE</option>
            </select>

            <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="bg-black/30 p-3 rounded-xl border border-white/5">
              <option value="">Severity</option>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
              <option>Critical</option>
            </select>

            <select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })} className="bg-black/30 p-3 rounded-xl border border-white/5">
              <option value="">Urgency</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Immediate</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input 
              type="number"
              value={form.affectedCount} 
              onChange={e => setForm({ ...form, affectedCount: e.target.value })} 
              placeholder="People Affected (Count)" 
              className="bg-black/30 p-3 rounded-xl border border-white/5 focus:border-blue-500 outline-none" 
            />
            <input 
              type="number"
              value={form.injuredCount} 
              onChange={e => setForm({ ...form, injuredCount: e.target.value })} 
              placeholder="Injured (Count)" 
              className="bg-black/30 p-3 rounded-xl border border-white/5 focus:border-blue-500 outline-none" 
            />
            <input 
              value={form.missing} 
              onChange={e => setForm({ ...form, missing: e.target.value })} 
              placeholder="Missing (Est.)" 
              className="bg-black/30 p-3 rounded-xl border border-white/5 focus:border-blue-500 outline-none" 
            />
          </div>
        </section>

        {/* --- INFRASTRUCTURE --- */}
        <section>
          <h2 className="text-lg font-semibold mb-3">🏚 Infrastructure Damage</h2>
          <div className="grid grid-cols-3 gap-3">
            {infraOptions.map(i => (
              <label key={i} className={`p-3 rounded-xl cursor-pointer border transition-all ${form.infra.includes(i) ? 'bg-red-900/40 border-red-500' : 'bg-black/30 border-white/5 hover:bg-white/5'}`}>
                <input type="checkbox" className="mr-2" checked={form.infra.includes(i)} onChange={() => toggleArrayValue("infra", i)} /> {i}
              </label>
            ))}
          </div>
        </section>

        {/* --- NEEDS --- */}
        <section>
          <h2 className="text-lg font-semibold mb-3">🚑 Immediate Needs</h2>
          <div className="grid grid-cols-4 gap-3">
            {needsOptions.map(n => (
              <label key={n} className={`p-3 rounded-xl cursor-pointer border transition-all ${form.needs.includes(n) ? 'bg-orange-900/40 border-orange-500' : 'bg-black/30 border-white/5 hover:bg-white/5'}`}>
                <input type="checkbox" className="mr-2" checked={form.needs.includes(n)} onChange={() => toggleArrayValue("needs", n)} /> {n}
              </label>
            ))}
          </div>
        </section>

        {/* --- VERIFIED BY --- */}
        <input
          value={form.verifiedBy}
          onChange={e => setForm({ ...form, verifiedBy: e.target.value })}
          placeholder="Verified By (Volunteer Name / ID)"
          className="w-full bg-black/30 p-4 rounded-xl border border-white/10 focus:border-blue-500 outline-none"
        />

        {/* --- CAMPS SECTION --- */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-t border-white/10 pt-6">
            <h2 className="text-xl font-semibold">🏕 Camp Information</h2>
            <button type="button" onClick={addCamp} className="bg-green-600 hover:bg-green-500 transition px-5 py-2 rounded-xl font-bold text-sm">
                ➕ Add Camp
            </button>
          </div>

          {camps.map((camp, i) => (
            <div key={i} className="bg-[#0f172a] p-6 rounded-xl border border-white/10 space-y-4 shadow-lg">
              <h3 className="text-blue-400 font-bold uppercase text-xs tracking-wider">Camp #{i + 1} Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Camp Name" onChange={e => updateCamp(i, "name", e.target.value)} className="bg-black/30 p-3 rounded-xl border border-white/5" />
                <input placeholder="Camp Location" onChange={e => updateCamp(i, "location", e.target.value)} className="bg-black/30 p-3 rounded-xl border border-white/5" />
                <input placeholder="Capacity" onChange={e => updateCamp(i, "capacity", e.target.value)} className="bg-black/30 p-3 rounded-xl border border-white/5" />
                <input placeholder="Current People" onChange={e => updateCamp(i, "people", e.target.value)} className="bg-black/30 p-3 rounded-xl border border-white/5" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {campNeeds.map(n => (
                  <label key={n} className="bg-black/30 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition flex items-center gap-2">
                    <input type="checkbox" onChange={() => toggleCampNeed(i, n)} /> <span className="text-sm">{n}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-lg tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
          TRANSMIT INTEL TO COMMAND
        </button>
      </form>
    </div>
  );
}