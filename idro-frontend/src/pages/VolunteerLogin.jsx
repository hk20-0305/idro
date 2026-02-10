import {
  ArrowLeft,
  ChevronRight,
  Database,
  Globe,
  Lock,
  Radio,
  ShieldCheck,
  Users
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  // State to track the selected user type
  const [userType, setUserType] = useState(""); // 'volunteer' | 'government' | 'ngo'
  const [agencyType, setAgencyType] = useState(""); // For government agency type selection

  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (userType === "volunteer") {
      if (!id || !pass) {
        setError("Please enter both Volunteer ID and Password");
        return;
      }

      import("axios").then(({ default: axios }) => {
        axios.post("http://localhost:8085/api/volunteer/login", {
          volunteerId: id,
          password: pass
        })
          .then((response) => {
            if (response.data.success) {
              localStorage.setItem("volunteer", JSON.stringify(response.data.volunteer));
              navigate("/volunteer-form");
            } else {
              setError(response.data.message || "Invalid Volunteer credentials");
            }
          })
          .catch((err) => {
            setError("Invalid Volunteer ID or Password");
          });
      });
    }
    else if (userType === "government") {
      if (!agencyType) {
        setError("Please select an agency type");
        return;
      }
      if (id === "a" && pass === "b") {
        navigate("/government-dashboard");
      } else {
        setError("Invalid Government Credentials (Use: a / b)");
      }
    }
    else if (userType === "ngo") {
      if (!id || !pass) {
        setError("Please enter both NGO ID and Password");
        return;
      }

      import("../services/ngoApi").then(({ ngoApi }) => {
        ngoApi.loginNGO(id, pass)
          .then((response) => {
            if (response.success) {
              localStorage.setItem("ngoProfile", JSON.stringify(response.ngoProfile));
              localStorage.setItem("ngoId", response.ngoProfile.ngoId);
              navigate("/ngo-dashboard");
            } else {
              setError(response.message || "Invalid NGO credentials");
            }
          })
          .catch((err) => {
            setError("Invalid NGO ID or Password");
          });
      });
    }
  };

  const getInputLabel = () => {
    if (userType === "government") return "Government Agency ID";
    if (userType === "ngo") return "NGO ID";
    return "Volunteer ID";
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Background: Mesh Gradient and Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,58,138,0.15)_0%,transparent_50%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.6)_0%,transparent_50%)] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none z-0"></div>

      {/* Abstract Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>

      <div className="w-full max-w-6xl relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Radio size={12} className="animate-pulse" /> IDRO Global Network Access
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
            LOGIN <span className="text-blue-500">PORTAL</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Select your administrative authority to access authorized relief operations,
            resource deployment, and tactical disaster coordination.
          </p>
        </div>

        {/* --- PORTAL SELECTION --- */}
        {!userType ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Volunteer Login Card */}
            <PortalCard
              icon={<Users size={32} />}
              title="Volunteer"
              description="Contribute to real-time ground intelligence and humanitarian field support."
              color="blue"
              onClick={() => setUserType("volunteer")}
            />

            {/* NGO Card */}
            <PortalCard
              icon={<Globe size={32} />}
              title="NGO Organization"
              description="Coordinate inter-agency logistics, supply chains, and large-scale relief missions."
              color="purple"
              onClick={() => setUserType("ngo")}
            />

            {/* Government Card */}
            <PortalCard
              icon={<ShieldCheck size={32} />}
              title="Gov Command"
              description="Strategic oversight, tactical authorizations, and national emergency management."
              color="emerald"
              onClick={() => navigate("/government-login")}
            />
          </div>
        ) : (
          /* --- LOGIN FORM SECTION --- */
          <div className="max-w-md mx-auto">
            <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              {/* Decorative Glow */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 transition-colors ${userType === 'volunteer' ? 'bg-blue-500' : userType === 'ngo' ? 'bg-purple-500' : 'bg-emerald-500'
                }`}></div>

              <button
                onClick={() => { setUserType(""); setAgencyType(""); setError(""); setId(""); setPass(""); }}
                className="text-slate-400 hover:text-white mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors group/back"
              >
                <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                Back to Selection
              </button>

              <div className="mb-10">
                <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                  {userType === "volunteer" && "Volunteer Uplink"}
                  {userType === "government" && "Command Access"}
                  {userType === "ngo" && "Organization Portal"}
                </h3>
                <p className="text-slate-500 text-sm font-medium">Verify credentials for secure terminal access</p>
              </div>

              <div className="space-y-6">
                {/* Government Agency Type Selection */}
                {userType === "government" && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Agency Authority</label>
                    <select
                      value={agencyType}
                      onChange={(e) => setAgencyType(e.target.value)}
                      className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer transition-all"
                    >
                      <option value="" disabled className="bg-slate-900">-- SELECT AUTHORITY --</option>
                      <option value="ndrf" className="bg-slate-900">NDRF - NATIONAL RELIEF FORCE</option>
                      <option value="medical" className="bg-slate-900">CENTRAL MEDICAL CORPS</option>
                      <option value="fire" className="bg-slate-900">NATIONAL FIRE COMMAND</option>
                      <option value="others" className="bg-slate-900">OTHER ALLIED AGENCIES</option>
                    </select>
                  </div>
                )}

                {/* Account Selection for Pre-Approved IDs */}
                {(userType === "ngo" || userType === "volunteer") && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">{getInputLabel()}</label>
                    <select
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className={`w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:ring-2 appearance-none cursor-pointer transition-all ${userType === 'volunteer' ? 'focus:ring-blue-500/50' : 'focus:ring-purple-500/50'
                        }`}
                    >
                      <option value="" disabled className="bg-slate-900">-- SELECT IDENTITY --</option>
                      {userType === "ngo" ? (
                        <>
                          <option value="NGO001" className="bg-slate-900">NGO001 - RED CROSS INDIA</option>
                          <option value="NGO002" className="bg-slate-900">NGO002 - CARE INDIA</option>
                          <option value="NGO003" className="bg-slate-900">NGO003 - OXFAM INDIA</option>
                          <option value="NGO004" className="bg-slate-900">NGO004 - SAVE THE CHILDREN</option>
                          <option value="NGO005" className="bg-slate-900">NGO005 - GOONJ RELIEF</option>
                        </>
                      ) : (
                        <>
                          <option value="V001" className="bg-slate-900">V001 - SECTOR LEAD</option>
                          <option value="V002" className="bg-slate-900">V002 - FIELD MEDIC</option>
                          <option value="V003" className="bg-slate-900">V003 - LOGISTICS COORDINATOR</option>
                          <option value="V004" className="bg-slate-900">V004 - SAR SPECIALIST</option>
                          <option value="V005" className="bg-slate-900">V005 - COMMUNICATIONS</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Legacy Manual Input (Fallback) */}
                {userType === "government" && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Command ID</label>
                    <div className="relative">
                      <Database size={18} className="absolute left-4 top-4 text-slate-600" />
                      <input
                        placeholder="ENTER AUTHORIZATION ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full p-4 pl-12 bg-black/40 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all uppercase"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Access Terminal Key</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-4 text-slate-600" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className={`w-full p-4 pl-12 bg-black/40 border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 transition-all ${userType === 'volunteer' ? 'focus:ring-blue-500/50' : userType === 'ngo' ? 'focus:ring-purple-500/50' : 'focus:ring-emerald-500/50'
                        }`}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2 animate-shake">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  className={`w-full py-5 rounded-2xl font-black text-white text-sm uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 group/btn ${userType === 'volunteer'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
                      : userType === 'ngo'
                        ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
                    }`}
                >
                  Establish Connection <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PortalCard({ icon, title, description, color, onClick }) {
  const colorMap = {
    blue: "hover:border-blue-500/50 hover:bg-blue-900/10 group-hover:text-blue-400 border-blue-500/10 shadow-blue-500/5 bg-blue-500/20",
    purple: "hover:border-purple-500/50 hover:bg-purple-900/10 group-hover:text-purple-400 border-purple-500/10 shadow-purple-500/5 bg-purple-500/20",
    emerald: "hover:border-emerald-500/50 hover:bg-emerald-900/10 group-hover:text-emerald-400 border-emerald-500/10 shadow-emerald-500/5 bg-emerald-600/20"
  };

  const iconBase = {
    blue: "bg-blue-600 shadow-blue-500/40",
    purple: "bg-purple-600 shadow-purple-500/40",
    emerald: "bg-emerald-600 shadow-emerald-500/40"
  };

  return (
    <div
      onClick={onClick}
      className={`p-10 rounded-[3rem] border bg-slate-900/40 backdrop-blur-md shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col items-center text-center ${colorMap[color]}`}
    >
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl ${iconBase[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:translate-y-[-2px] transition-transform">
        {title}
      </h3>
      <p className="text-slate-400 text-sm font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
        {description}
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        Initiate Protocol <ChevronRight size={14} />
      </div>
    </div>
  );
}