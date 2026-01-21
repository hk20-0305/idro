import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Home, LayoutDashboard, Rss, ShieldAlert, Cloud, Bell, 
  MapPin, Activity, ArrowRight, Users, Heart, Phone, Tent, TriangleAlert 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed or use fetch
import { idroApi } from '../services/api';

// --- LEAFLET ICON FIX ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- NEON ICONS ---
const getIcon = (status, type, trustScore) => {
    let colorClass = 'bg-red-500';
    let pulseClass = 'animate-ping';

    if (status === 'ASSIGNED') colorClass = 'bg-orange-500';
    if (status === 'RESOLVED') colorClass = 'bg-green-500';
    if (trustScore < 50) pulseClass = ''; 

    return L.divIcon({
      className: 'custom-icon',
      html: `<div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full opacity-40 ${pulseClass} ${colorClass}"></div>
        <div class="relative w-4 h-4 rounded-full border border-white shadow-xl flex items-center justify-center text-[8px] font-bold z-10 ${
             status === 'OPEN' ? 'bg-red-600 text-white' : 
             status === 'ASSIGNED' ? 'bg-orange-500 text-white' : 
             'bg-green-600 text-white'
        }">
        </div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
};

// --- COMPONENT TO AUTO-CENTER MAP ON DISASTER ---
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 7, { duration: 2.5 }); 
    }
  }, [center, map]);
  return null;
}

export default function IdroHome() {
  const [alerts, setAlerts] = useState([]);
  const [latestDisaster, setLatestDisaster] = useState(null);
  const [formattedLocation, setFormattedLocation] = useState("Locating..."); // Store real city name
  const navigate = useNavigate();

  // --- REVERSE GEOCODING HELPER ---
  // Converts (22.29, 73.36) -> "Vadodara, Gujarat"
  const fetchLocationName = async (lat, lng) => {
      try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const addr = response.data.address;
          // Prioritize: City -> Town -> Village -> County
          const city = addr.city || addr.town || addr.village || addr.county || "Unknown Location";
          const state = addr.state || "";
          return `${city}, ${state}`;
      } catch (error) {
          return null; // Fail silently, fallback to coordinates
      }
  };

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchPublicAlerts = async () => {
        try {
            const res = await idroApi.getAlerts();
            if (res.data && res.data.length > 0) {
                const publicAlerts = res.data.filter(a => a.missionStatus === 'OPEN');
                setAlerts(publicAlerts);
                
                // Process the TOP Alert (Disaster Occurred)
                if (publicAlerts.length > 0) {
                    const topAlert = publicAlerts[0];
                    setLatestDisaster(topAlert);
                    
                    // IF location looks like "Report (22...)" -> Convert it
                    // ELSE -> Use it as is
                    if (topAlert.location.includes("Report") || topAlert.location.includes("(")) {
                        const realName = await fetchLocationName(topAlert.latitude, topAlert.longitude);
                        setFormattedLocation(realName || topAlert.location);
                    } else {
                        setFormattedLocation(topAlert.location);
                    }
                }
            }
        } catch (err) { console.error("API Error"); }
    };

    fetchPublicAlerts();
    const interval = setInterval(fetchPublicAlerts, 10000); // 10s refresh (slower to save API quota)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 relative overflow-x-hidden flex flex-col">
      
      {/* --- TICKER --- */}
      <div className="bg-red-950/90 border-b border-red-900 text-white text-xs font-bold py-2 overflow-hidden flex items-center relative z-[60]">
          <div className="bg-red-700 px-4 py-2 absolute left-0 z-10 flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
             <ShieldAlert size={14} className="animate-pulse"/> LIVE INTEL
          </div>
          <div className="whitespace-nowrap animate-marquee pl-32 flex gap-8 text-red-100/80">
              <span>⚠️ SAT-ALERT: Cyclone formation detected in Bay of Bengal.</span>
              <span>⚠️ GROUND-REP: Flash floods reported in Northern Sector.</span>
          </div>
      </div>

      {/* --- HEADER --- */}
<header className="backdrop-blur-md border-b border-white/10 sticky top-0 z-50
  bg-gradient-to-r from-orange-500 via-white to-green-500">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                <Activity size={24} className="text-blue-400" />
              </div>
             <h1 className="font-black text-xl tracking-wider leading-none flex flex-wrap">
  <span className="text-black">IDRO – Intellig</span>
  <span className="text-black">ent Disaster Resource</span>
  <span className="text-black"> Optimizer</span>
</h1>
<h5><p className="text-[11px] text-black font-semibold tracking-wide italic">
  One platform to save millions of lives
</p>
</h5>

            </div>
            <nav className="hidden md:flex gap-2">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
                <Home size={14}/> HOME
              </Link>
              <Link to="/command" className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                <LayoutDashboard size={14}/> DASHBOARD
              </Link>
              <Link to="/response" className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                <Rss size={14}/> LIVE FEED
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* --- STATS --- */}
      <div className="bg-[#1e293b] border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                  SYSTEM STATUS: <span className="font-bold text-green-400">ONLINE</span>
              </div>
              <div className="flex gap-6 font-mono">
                  <div className="flex items-center gap-2 font-bold text-slate-300"><Users size={14} className="text-blue-500"/> 12,450 VOLUNTEERS</div>
                  <div className="flex items-center gap-2 font-bold text-slate-300"><Tent size={14} className="text-orange-500"/> 85 ACTIVE CAMPS</div>
              </div>
          </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* --- ACTION CARDS --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div onClick={() => navigate('/command')} className="cursor-pointer bg-[#1e293b] rounded-xl p-5 border border-white/5 hover:border-blue-500/50 hover:bg-[#253045] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><MapPin size={80}/></div>
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><MapPin /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Command Grid</h3>
                    <p className="text-[10px] text-slate-400 font-mono">LIVE OPS MAP</p>
                  </div>
              </div>
          </div>
          <div onClick={() => navigate('/command')} className="cursor-pointer bg-[#1e293b] rounded-xl p-5 border border-white/5 hover:border-red-500/50 hover:bg-[#253045] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert size={80}/></div>
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 text-red-400 rounded-lg"><ShieldAlert /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Alerts</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{alerts.length} ACTIVE THREATS</p>
                  </div>
              </div>
          </div>
          <div onClick={() => navigate('/response')} className="cursor-pointer bg-[#1e293b] rounded-xl p-5 border border-white/5 hover:border-orange-500/50 hover:bg-[#253045] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><LayoutDashboard size={80}/></div>
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg"><LayoutDashboard /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Response Unit</h3>
                    <p className="text-[10px] text-slate-400 font-mono">DEPLOY ASSETS</p>
                  </div>
              </div>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Cloud size={80}/></div>
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><Cloud /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">AI Forecast</h3>
                    <p className="text-[10px] text-slate-400 font-mono">PREDICTIVE MODEL</p>
                  </div>
              </div>
          </div>
        </section>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px] overflow-hidden">
          
          {/* 1. LEFT: DISASTER OCCURRED PANEL (Auto-City Name) */}
          <div className="lg:col-span-3 h-full">
             <div className="bg-[#2a1212] border border-red-500/30 rounded-xl p-6 relative overflow-hidden h-full flex flex-col shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="flex items-center gap-2 mb-4 border-b border-red-500/30 pb-3 z-10 shrink-0">
                 <TriangleAlert className="text-red-500" size={20}/>
                 <h3 className="font-black text-red-400 text-xs uppercase tracking-[0.2em]">Disaster Detected</h3>
              </div>
              
              {latestDisaster ? (
                  <>
                      <div className="z-10 flex-1 overflow-y-auto custom-scrollbar mb-4">
                          {/* ✅ HERE IS THE MAGIC: Shows "Vadodara, Gujarat" */}
                          <h1 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                             {formattedLocation}
                          </h1>
                          <div className="flex gap-2 mb-4">
                              <span className="text-[10px] font-bold bg-red-600 text-white px-3 py-1 rounded border border-red-400 uppercase tracking-wider shadow-[0_0_10px_#dc2626]">
                                 {latestDisaster.type}
                              </span>
                              <span className="text-[10px] font-bold bg-black/50 text-red-400 border border-red-500/30 px-3 py-1 rounded font-mono">
                                 LVL 5 CRITICAL
                              </span>
                          </div>
                          <p className="text-xs text-red-100/80 font-medium leading-relaxed">
                              {latestDisaster.details}
                          </p>
                      </div>
                      
                      <div className="z-20 shrink-0 mt-auto">
                        <div className="bg-black/40 rounded p-3 mb-3 text-[10px] text-red-200 border border-red-500/20 shadow-inner">
                            <strong className="text-red-400 block mb-1 tracking-wider">🤖 AI IMPACT ANALYSIS:</strong>
                            Critical Infrastructure at risk. Immediate evacuation of Sector 4 advised.
                        </div>
                        <button onClick={() => navigate('/response')} className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-black py-3 rounded shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-red-400 hover:scale-[1.02]">
                            View Incident Report <ArrowRight size={14}/>
                        </button>
                      </div>
                  </>
              ) : (
                  <div className="text-center py-20 z-10">
                      <p className="text-sm text-red-400 font-bold italic opacity-50">Scanning Grid...</p>
                  </div>
              )}
            </div>
          </div>

          {/* 2. CENTER: SATELLITE MAP */}
          <div className="lg:col-span-6 h-full">
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden h-full flex flex-col shadow-2xl relative">
               
               <div className="absolute top-4 left-4 z-[400] bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-xs font-bold text-white tracking-widest uppercase">Live Satellite Feed</span>
               </div>

               <div className="absolute top-4 right-4 z-[400]">
                  <Link to="/command" className="text-[10px] font-bold bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2 rounded border border-blue-400/50 uppercase tracking-widest flex items-center gap-2 shadow-lg backdrop-blur-sm">
                    Full Command <ArrowRight size={12}/>
                  </Link>
               </div>
              
               <main className="flex-1 relative bg-black h-full">
                 <MapContainer center={[22.5, 82.0]} zoom={5} className="w-full h-full z-0" zoomControl={false}>
                    {/* ✅ AUTO-CENTER LOGIC */}
                    <MapUpdater center={latestDisaster ? [latestDisaster.latitude, latestDisaster.longitude] : null} />
                    
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Esri" />
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
                    
                    {alerts.map(alert => (
                        <Marker key={alert.id} position={[alert.latitude || 20, alert.longitude || 78]} icon={getIcon(alert.missionStatus, alert.sourceType, alert.trustScore)}>
                          <Popup className="custom-popup-dark">
                              <div className="p-2 min-w-[200px] bg-[#0f172a] text-white rounded border border-white/10">
                                  <h3 className="text-sm font-black text-white mb-1 border-b border-white/10 pb-1">
                                    {/* Try to show name, else show lat/long */}
                                    {formattedLocation && alert.id === latestDisaster?.id ? formattedLocation : alert.location}
                                  </h3>
                                  <strong className="uppercase text-blue-400 text-xs block mb-1">{alert.type}</strong>
                                  <p className="text-[10px] text-slate-300 mb-2">{alert.details}</p>
                              </div>
                          </Popup>
                          {alert.missionStatus === 'OPEN' && <Circle center={[alert.latitude, alert.longitude]} radius={60000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }} />}
                        </Marker>
                    ))}
                 </MapContainer>
               </main>
            </div>
          </div>

          {/* 3. RIGHT: ALERT LIST */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden h-full flex flex-col">
              <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-[#253045]/50 shrink-0">
                <h2 className="font-bold text-slate-200 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Bell size={14} className="text-slate-500"/> Intel Stream
                </h2>
                <span className="text-[10px] text-blue-400 font-bold animate-pulse">LIVE UPDATES</span>
              </div>
              
              <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar flex-1">
                {alerts.length === 0 && <div className="p-6 text-center text-slate-600 text-xs italic">No active alerts. Grid Secure.</div>}
                
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${
                          alert.missionStatus === 'OPEN' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        PRE {alert.type}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">T-MINUS 5M</span>
                    </div>
                    {/* Shows Location Name if available, else standard text */}
                    <h3 className="font-bold text-slate-200 text-xs group-hover:text-blue-400 transition-colors mb-1">
                        {alert.id === latestDisaster?.id ? formattedLocation : alert.location}
                    </h3>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{alert.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- SOS BUTTON --- */}
      <div className="fixed bottom-8 right-8 z-[100]">
          <button className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center animate-bounce-slow transition-transform hover:scale-110 border-2 border-red-400">
              <Phone size={24} className="fill-current"/>
          </button>
      </div>

    </div>
  );
}