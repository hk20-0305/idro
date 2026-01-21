import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import GovernmentDashboard from './components/GovernmentDashboard';
import NGODashboard from './components/NGODashboard'; 
import VolunteerDashboard from './components/VolunteerDashboard'; 
import AnalyticsDashboard from './components/AnalyticsDashboard'; // Imported
import RoleSelector from './RoleSelector';
import { Languages, Activity } from 'lucide-react';

// Custom Map Marker Logic
const createPulseIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12">
        <div class="absolute w-full h-full rounded-full opacity-50 animate-ping ${color === 'red' ? 'bg-red-500' : 'bg-orange-500'}"></div>
        <div class="relative p-2 rounded-full border-2 border-white shadow-xl ${color === 'red' ? 'bg-red-600' : 'bg-orange-500'}">
          ${color === 'red' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' 
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
          }
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

export default function Dashboard() {
  const [userRole, setUserRole] = useState('gov');
  const [lang, setLang] = useState('en');

  // RESTORED: The renderDashboard function handles the switching logic cleanly
  const renderDashboard = () => {
    switch(userRole) {
      case 'gov':
        return <GovernmentDashboard lang={lang} />;
      case 'ngo':
        return <NGODashboard lang={lang} />;
      case 'volunteer':
        return <VolunteerDashboard lang={lang} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <GovernmentDashboard lang={lang} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden font-sans text-white">
      
      {/* 1. HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-white/10 px-6 py-3 shadow-2xl flex items-center justify-between">
          
          {/* Left: LOGO */}
          <div className="flex items-center gap-3 w-1/3">
            <div className="bg-red-600 p-2 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide">IDRO</h1>
              <p className="text-[10px] text-blue-400 font-bold tracking-[0.2em]">DISASTER RESPONSE</p>
            </div>
          </div>

          {/* Center: ROLE SWITCHER */}
          <div className="flex justify-center w-1/3">
            <RoleSelector currentRole={userRole} setRole={setUserRole} />
          </div>

          {/* Right: LANGUAGE */}
          <div className="flex justify-end w-1/3">
            <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-800 border border-white/10 px-4 py-2 rounded-lg hover:bg-slate-700 transition">
                <Languages size={16} className="text-blue-400" />
                <span className="text-xs font-bold uppercase">{lang === 'en' ? 'EN' : 'HI'}</span>
                </button>
                <div className="absolute top-full right-0 pt-2 w-32 hidden group-hover:block">
                <div className="bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                    <button onClick={() => setLang('en')} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-700">English</button>
                    <button onClick={() => setLang('hi')} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-700">Hindi</button>
                </div>
                </div>
            </div>
          </div>
      </div>

      {/* 2. BACKGROUND MAP (Satellite) */}
      <div className="fixed inset-0 top-[72px] z-0 bg-black">
        <MapContainer center={[22.5937, 78.9629]} zoom={5} scrollWheelZoom={true} className="w-full h-full" zoomControl={false}>
          <TileLayer attribution='Tiles &copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
          
          <Marker position={[31.1048, 77.1734]} icon={createPulseIcon('red')}>
            <Popup><div className="p-1"><h3 className="font-bold text-red-600">EARTHQUAKE</h3></div></Popup>
          </Marker>
          <Marker position={[26.2006, 92.9376]} icon={createPulseIcon('orange')}>
            <Popup><div className="p-1"><h3 className="font-bold text-orange-600">FLOOD</h3></div></Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* 3. OVERLAYS (Dashboard Views) */}
      {/* We use renderDashboard() here to switch views */}
      <div className="relative z-10 pt-[72px] pointer-events-none h-screen">
        {renderDashboard()}
      </div>
    </div>
  );
}