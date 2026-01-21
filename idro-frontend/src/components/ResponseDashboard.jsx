import React, { useState, useEffect } from 'react';
import { 
  Truck, CheckCircle, Navigation, ArrowLeft, 
  Flame, Droplets, HeartPulse, Shield, AlertTriangle, ShieldAlert 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { idroApi } from '../services/api';

export default function ResponseDashboard() {
  const [missions, setMissions] = useState([]);
  const [myTeam] = useState("NDRF-Alpha"); 
  const [activeTab, setActiveTab] = useState('AVAILABLE');

  // --- 1. FETCH REAL DATA ---
  const fetchData = async () => {
      try {
        const res = await idroApi.getAlerts();
        if (res.data) setMissions(res.data);
      } catch (err) { console.error("Waiting for backend..."); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); 
    return () => clearInterval(interval);
  }, []);

  // --- 2. ACCEPT MISSION (WITH TRUST CHECK) ---
  const acceptMission = async (mission) => {
      // 🛑 SAFETY CHECK: If Trust is low, ask for confirmation
      if ((mission.trustScore || 0) < 50) {
          const confirm = window.confirm(
              `⚠ WARNING: LOW TRUST ALERT (${mission.trustScore || 35}%)\n\n` +
              `This report is unverified. Are you sure you want to deploy resources?\n` +
              `It is recommended to send a Scout Unit first.`
          );
          if (!confirm) return; // Stop if they say Cancel
      }

      try {
          await idroApi.assignMission(mission.id, myTeam);
          alert("✅ Mission Confirmed! GPS Coordinates Loaded.");
          fetchData(); 
      } catch (err) { 
          alert("❌ Mission unavailable."); 
          fetchData();
      }
  };

  const availableMissions = missions.filter(m => m.missionStatus === 'OPEN');
  const myMissions = missions.filter(m => m.responderName === myTeam);

  const getTypeIcon = (type) => {
      if (type === 'FIRE') return <Flame className="text-orange-500" />;
      if (type === 'FLOOD') return <Droplets className="text-blue-500" />;
      if (type === 'MEDICAL') return <HeartPulse className="text-red-500" />;
      return <AlertTriangle className="text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
       
       {/* HEADER */}
       <header className="h-16 bg-[#1e293b] border-b border-white/10 flex items-center justify-between px-6 shadow-xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20}/></Link>
              <div>
                  <h1 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                     <Truck className="text-green-500" /> Response Unit
                  </h1>
                  <p className="text-[10px] text-slate-400">ID: <span className="text-white font-bold">{myTeam}</span></p>
              </div>
          </div>
          <div className="flex gap-2">
              <button onClick={() => setActiveTab('AVAILABLE')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'AVAILABLE' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>Available ({availableMissions.length})</button>
              <button onClick={() => setActiveTab('MY_MISSIONS')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'MY_MISSIONS' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>Active ({myMissions.length})</button>
          </div>
       </header>

       {/* CONTENT */}
       <div className="p-6 max-w-5xl mx-auto">
          
          {/* TAB: AVAILABLE MISSIONS */}
          {activeTab === 'AVAILABLE' && (
              <div className="space-y-4">
                  {availableMissions.length === 0 && (
                      <div className="text-center py-20 text-slate-500">
                          <CheckCircle size={48} className="mx-auto mb-4 opacity-20"/>
                          <h2 className="text-xl font-bold">All Clear</h2>
                      </div>
                  )}

                  {availableMissions.map(mission => (
                      <div key={mission.id} className={`border p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all shadow-lg ${
                          (mission.trustScore || 0) < 50 ? 'bg-red-900/10 border-red-500/30' : 'bg-[#1e293b] border-white/5 hover:border-blue-500/50'
                      }`}>
                          <div className="flex items-start gap-4">
                              <div className="p-3 bg-[#0f172a] rounded-lg border border-white/10">
                                  {getTypeIcon(mission.type)}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-lg font-black uppercase text-white">{mission.type}</h3>
                                      {/* TRUST BADGE */}
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                          (mission.trustScore || 0) > 80 ? 'bg-green-900 text-green-400 border-green-500/30' : 
                                          (mission.trustScore || 0) > 40 ? 'bg-yellow-900 text-yellow-400 border-yellow-500/30' : 
                                          'bg-red-900 text-red-400 border-red-500/30'
                                      }`}>
                                          TRUST: {mission.trustScore || 35}%
                                      </span>
                                  </div>
                                  <p className="text-xs text-slate-400 font-mono mb-1">📍 {mission.location}</p>
                                  <p className="text-sm text-slate-300 max-w-xl">{mission.details}</p>
                                  
                                  {(mission.trustScore || 0) < 50 && (
                                      <div className="mt-2 flex items-center gap-2 text-[10px] text-red-400 font-bold bg-red-950/50 p-1.5 rounded w-fit border border-red-500/20">
                                          <ShieldAlert size={12}/> UNVERIFIED REPORT - DEPLOY WITH CAUTION
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          <button 
                             onClick={() => acceptMission(mission)}
                             className={`w-full md:w-auto px-8 py-3 font-bold uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                                 (mission.trustScore || 0) < 50 
                                 ? 'bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white' 
                                 : 'bg-blue-600 hover:bg-blue-500 text-white'
                             }`}
                          >
                             <Navigation size={16}/> {(mission.trustScore || 0) < 50 ? 'Investigate' : 'Deploy Team'}
                          </button>
                      </div>
                  ))}
              </div>
          )}

          {/* TAB: MY ACTIVE MISSIONS */}
          {activeTab === 'MY_MISSIONS' && (
              <div className="space-y-4">
                  {myMissions.map(mission => (
                      <div key={mission.id} className="bg-green-900/10 border border-green-500/30 p-6 rounded-xl flex items-center justify-between relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-black uppercase text-green-400">{mission.type}</h3>
                                  <span className="bg-green-500 text-black text-[10px] font-bold px-2 rounded">ACTIVE</span>
                              </div>
                              <p className="text-sm text-slate-300">📍 {mission.location}</p>
                          </div>
                      </div>
                  ))}
              </div>
          )}

       </div>
    </div>
  );
}