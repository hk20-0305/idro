import { useEffect, useState } from "react";
import { idroApi } from "../services/api";

export default function VolunteerForm() {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  const [form, setForm] = useState({
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

  const [camps, setCamps] = useState([]);

  const infraOptions = [
    "Roads Blocked",
    "Bridge Collapse",
    "Power Failure",
    "Water Failure",
    "Mobile Network Down"
  ];

  const needsOptions = [
    "Food", "Water", "Medicines", "Shelter", "Ambulance",
    "NDRF", "Evacuation", "Helicopter"
  ];

  const campNeeds = [
    "Food", "Water", "Medicines", "Beds", "Blankets",
    "Electricity", "Toilets", "Ambulance", "Volunteers"
  ];

  const disasterTypes = [
  "Flood", "Earthquake", "Fire", "Cyclone", "Landslide",
  "Tsunami", "Drought", "Heatwave", "Cold Wave",
  "Building Collapse", "Industrial Accident", "Gas Leak",
  "Explosion", "Road Accident", "Stampede", "Pandemic", "Other"
];

const severityLevels = ["Low", "Moderate", "High", "Critical"];

const urgencyLevels = ["Low", "Medium", "Immediate"];


  // Accurate coordinates
  const locationCoordinates = {
    "Bhuj": { lat: 23.2530, lng: 69.6693 },
    "Bhuj, Gujarat": { lat: 23.2530, lng: 69.6693 },
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "Delhi": { lat: 28.7041, lng: 77.1025 },
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Kolkata": { lat: 22.5726, lng: 88.3639 },
    "Bangalore": { lat: 12.9716, lng: 77.5946 },
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 }
  };

  const getCoordinatesForLocation = (location) => {
    const normalized = location.toLowerCase();
    if (locationCoordinates[location]) return locationCoordinates[location];

    for (const key in locationCoordinates) {
      if (normalized.includes(key.toLowerCase())) {
        return locationCoordinates[key];
      }
    }
    return { lat: 22.0, lng: 82.0 }; // India center fallback
  };

 useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const response = await idroApi.getAlerts();
      console.log("API response:", response.data);

      const open = response.data.filter(a => a.missionStatus === "OPEN");
      console.log("Filtered OPEN alerts:", open);

      setActiveAlerts(open);
    } catch (err) {
      console.error("Alert fetch failed", err);
    }
  };
  fetchAlerts();
}, []);


  const handleLocationChange = (e) => {
    const loc = e.target.value;
    const matched = activeAlerts.find(a => a.location === loc);

    setForm(prev => ({
      ...prev,
      location: loc,
      type: matched ? matched.type : ""
    }));

    setSelectedAlertId(matched ? matched.id : null);
  };

  const toggleArrayValue = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const addCamp = () => {
    setCamps([...camps, { name: "", location: "", people: "", needs: [] }]);
  };

  const updateCamp = (index, field, value) => {
    const copy = [...camps];
    copy[index][field] = value;
    setCamps(copy);
  };

  const toggleCampNeed = (index, need) => {
    const copy = [...camps];
    copy[index].needs = copy[index].needs.includes(need)
      ? copy[index].needs.filter(n => n !== need)
      : [...copy[index].needs, need];
    setCamps(copy);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.location || !form.type || !form.severity || !form.urgency) {
  alert("Please fill Location, Type, Severity and Urgency");
  return;
}


    const coords = getCoordinatesForLocation(form.location);

    const payload = {
  location: form.location,
  type: form.type.toUpperCase(),

  // New fields for UI compatibility
  color: form.severity === "High" ? "RED" : "ORANGE",
  magnitude: form.severity,
  impact: `Needs: ${form.needs.join(", ")}`,
  time: new Date().toLocaleString(),

  affectedCount: Number(form.affectedCount) || 0,
  injuredCount: Number(form.injuredCount) || 0,
  missing: form.missing,

  details: `Infra: ${form.infra.join(", ")} | Needs: ${form.needs.join(", ")}`,
  reporterLevel: "VOLUNTEER",
  sourceType: "VOLUNTEER-APP",
  missionStatus: "OPEN",
  latitude: coords.lat,
  longitude: coords.lng,
  trustScore: 80
};

    try {
      let alertId = selectedAlertId;

if (selectedAlertId) {
  await idroApi.updateReport(selectedAlertId, payload);
} else {
  const res = await idroApi.submitReport(payload);
  alertId = res.data.id; // ✅ CRITICAL
}


      for (const camp of camps) {
        if (!camp.name) continue;

        await idroApi.createCamp({
  name: camp.name,
  location: camp.location,
  population: Number(camp.people) || 0,
  latitude: coords.lat,
  longitude: coords.lng,
alertId: alertId,
  stock: {
    food: camp.needs.includes("Food") ? "Available" : "Low",
    water: camp.needs.includes("Water") ? "Available" : "Low",
    medicine: camp.needs.includes("Medicines") ? "Available" : "Low"
  }
});


      }

      alert("✅ Submitted successfully");
      setForm({ location:"",type:"",severity:"",urgency:"",affectedCount:"",injuredCount:"",missing:"",verifiedBy:"",infra:[],needs:[] });
      setCamps([]);
      setSelectedAlertId(null);

    } catch (err) {
      console.error(err);
      alert("❌ Submission failed");
    }
  };

    return (
    <div className="min-h-screen bg-[#0f172a] flex justify-center items-start pt-10 text-white">
      <form
        onSubmit={submit}
        className="w-[1000px] bg-[#1e293b] rounded-2xl border border-white/10 p-8 shadow-2xl space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">
          Volunteer Disaster Intelligence Panel
        </h1>

        {/* Location Information */}
<section className="space-y-4">
  <h2 className="text-blue-400 font-semibold">📍 Location Information</h2>

  {/* Alert dropdown */}
  <select
  value={form.location}
  onChange={(e) =>
    setForm(prev => ({ ...prev, location: e.target.value }))
  }
  className="w-full bg-slate-900 border border-slate-600 p-3 rounded"
>
  <option value="">Select Alert Location</option>

  <option value="Swargate, Pune">Swargate, Pune</option>
  <option value="Shivajinagar, Pune">Shivajinagar, Pune</option>
  <option value="Andheri East, Mumbai">Andheri East, Mumbai</option>
  <option value="Salt Lake, Kolkata">Salt Lake, Kolkata</option>
  <option value="Sector 62, Noida">Sector 62, Noida</option>
</select>


  {/* Extra fields */}
  {/* <div className="grid grid-cols-3 gap-4">
    <input
      placeholder="Village / Area"
      className="bg-slate-900 p-3 rounded border border-slate-600"
    />
    <input
      placeholder="District"
      className="bg-slate-900 p-3 rounded border border-slate-600"
    />
    <input
      placeholder="State"
      className="bg-slate-900 p-3 rounded border border-slate-600"
    />
  </div> */}
</section>


        {/* Location */}
        <section className="space-y-3">
  <h2 className="text-blue-400 font-semibold">🌀 Disaster Classification</h2>

  <div className="grid grid-cols-3 gap-4">

    {/* Disaster Type */}
    <select
      value={form.type}
      onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
      className="bg-slate-900 p-3 rounded border border-slate-600"
    >
      <option value="">Select Disaster Type</option>
      {disasterTypes.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>

    {/* Severity */}
    <select
      value={form.severity}
      onChange={(e) => setForm(prev => ({ ...prev, severity: e.target.value }))}
      className="bg-slate-900 p-3 rounded border border-slate-600"
    >
      <option value="">Severity Level</option>
      {severityLevels.map(level => (
        <option key={level} value={level}>{level}</option>
      ))}
    </select>

    {/* Urgency */}
    <select
      value={form.urgency}
      onChange={(e) => setForm(prev => ({ ...prev, urgency: e.target.value }))}
      className="bg-slate-900 p-3 rounded border border-slate-600"
    >
      <option value="">Urgency</option>
      {urgencyLevels.map(level => (
        <option key={level} value={level}>{level}</option>
      ))}
    </select>

  </div>
</section>

        {/* Disaster Classification */}
        {/* <section className="space-y-3">
          <h2 className="text-blue-400 font-semibold">🌀 Disaster Classification</h2>
          <div className="grid grid-cols-3 gap-4">
            <input disabled value={form.type} placeholder="Disaster Type" className="bg-slate-900 p-3 rounded border border-slate-600" />
            <input placeholder="Severity Level" className="bg-slate-900 p-3 rounded border border-slate-600" />
            <input placeholder="Urgency" className="bg-slate-900 p-3 rounded border border-slate-600" />
          </div>
        </section> */}

        {/* Human Impact */}
       <section className="space-y-3">
  <h2 className="text-blue-400 font-semibold">👥 Human Impact</h2>

  <div className="grid grid-cols-3 gap-4">
    <input
  placeholder="People Affected"
  value={form.affectedCount}
  onChange={(e) => setForm(prev => ({ ...prev, affectedCount: e.target.value }))}
  className="bg-slate-900 p-3 rounded border border-slate-600"
/>

<input
  placeholder="Injured Count"
  value={form.injuredCount}
  onChange={(e) => setForm(prev => ({ ...prev, injuredCount: e.target.value }))}
  className="bg-slate-900 p-3 rounded border border-slate-600"
/>

<input
  placeholder="Missing People"
  value={form.missing}
  onChange={(e) => setForm(prev => ({ ...prev, missing: e.target.value }))}
  className="bg-slate-900 p-3 rounded border border-slate-600"
/>

  </div>
</section>


        {/* Infrastructure */}
        <section className="space-y-3">
          <h2 className="text-blue-400 font-semibold">🏚 Infrastructure Damage</h2>
          <div className="grid grid-cols-3 gap-3">
            {infraOptions.map(opt => (
              <label key={opt} className="flex gap-2 items-center bg-slate-900 p-3 rounded border border-slate-700">
                <input
                  type="checkbox"
                  checked={form.infra.includes(opt)}
                  onChange={() => toggleArrayValue("infra", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </section>

        {/* Needs */}
        <section className="space-y-3">
          <h2 className="text-blue-400 font-semibold">📦 Immediate Needs</h2>
          <div className="grid grid-cols-3 gap-3">
            {needsOptions.map(opt => (
              <label key={opt} className="flex gap-2 items-center bg-slate-900 p-3 rounded border border-slate-700">
                <input
                  type="checkbox"
                  checked={form.needs.includes(opt)}
                  onChange={() => toggleArrayValue("needs", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </section>

        {/* Camps Section */}
<section className="space-y-4">
  <h2 className="text-blue-400 font-semibold">⛺ Relief Camps</h2>

  {camps.length === 0 && (
    <p className="text-sm text-slate-500">No camps added yet.</p>
  )}

  {camps.map((camp, index) => (
    <div
      key={index}
      className="bg-[#0f172a] border border-white/10 p-4 rounded-xl space-y-3"
    >
      <div className="grid grid-cols-3 gap-4">
        <input
          placeholder="Camp Name"
          value={camp.name}
          onChange={(e) => updateCamp(index, "name", e.target.value)}
          className="bg-slate-900 p-2 rounded border border-slate-600"
        />

        <input
          placeholder="Location"
          value={camp.location}
          onChange={(e) => updateCamp(index, "location", e.target.value)}
          className="bg-slate-900 p-2 rounded border border-slate-600"
        />

        <input
          placeholder="People Capacity"
          type="number"
          value={camp.people}
          onChange={(e) => updateCamp(index, "people", e.target.value)}
          className="bg-slate-900 p-2 rounded border border-slate-600"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 pt-2">
        {campNeeds.map(need => (
          <label
            key={need}
            className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700 text-sm"
          >
            <input
              type="checkbox"
              checked={camp.needs.includes(need)}
              onChange={() => toggleCampNeed(index, need)}
            />
            {need}
          </label>
        ))}
      </div>
    </div>
  ))}
</section>


        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={addCamp}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
          >
            + Add Camp
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
