import React from 'react';
import { ShieldAlert, Users, Truck, BarChart3 } from 'lucide-react'; 

export default function RoleSelector({ currentRole, setRole }) {
  const roles = [
    { id: 'gov', label: 'Command', icon: ShieldAlert, color: 'bg-red-600', border: 'border-red-500' },
    { id: 'ngo', label: 'NGO', icon: Truck, color: 'bg-green-600', border: 'border-green-500' },
    { id: 'volunteer', label: 'Field', icon: Users, color: 'bg-orange-600', border: 'border-orange-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-indigo-600', border: 'border-indigo-500' },
  ];

  return (
    <div className="flex bg-slate-800 p-1 rounded-lg border border-white/10 shadow-lg">
      {roles.map((role) => {
        const isActive = currentRole === role.id;
        const Icon = role.icon;
        
        return (
          <button
            key={role.id}
            onClick={() => setRole(role.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200
              ${isActive 
                ? `${role.color} text-white shadow-md scale-105` 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Icon size={16} />
            <span className={`text-xs font-bold uppercase ${isActive ? 'block' : 'hidden md:block'}`}>
              {role.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}