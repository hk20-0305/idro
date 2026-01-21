import React, { useState } from 'react';
import { Save, Wifi, WifiOff } from 'lucide-react';

export default function CampUpdateForm({ onClose }) {
  const [isOnline, setIsOnline] = useState(true); 

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md border border-slate-600 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Update Camp Status</h2>
          <button onClick={() => setIsOnline(!isOnline)} className="flex items-center gap-2 text-xs bg-slate-700 px-3 py-1 rounded-full border border-slate-600">
            {isOnline ? <Wifi size={14} className="text-green-400"/> : <WifiOff size={14} className="text-red-400"/>}
            {isOnline ? "Online" : "Offline Mode"}
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Current Population</label>
            <input type="number" placeholder="e.g. 1200" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Food Stock</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white">
                <option>Critical (0-1 Day)</option>
                <option>Low (2-3 Days)</option>
                <option>Stable (3+ Days)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Water Supply</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white">
                <option>Empty</option>
                <option>Low</option>
                <option>Sufficient</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 hover:text-white transition">Cancel</button>
             <button type="button" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
               <Save size={18} />
               {isOnline ? "Upload Live" : "Save Locally"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}