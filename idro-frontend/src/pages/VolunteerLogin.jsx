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
    // Using same credentials (a/b) for all user types for now
    if (userType === "volunteer") {
      if (!id || !pass) {
        setError("Please enter both Volunteer ID and Password");
        return;
      }

      // Call volunteer login API
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
      // Validate agency type selection
      if (!agencyType) {
        setError("Please select an agency type");
        return;
      }
      // Using same credentials as volunteer for now
      if (id === "a" && pass === "b") {
        navigate("/government-dashboard"); // Example route
      } else {
        setError("Invalid Government Credentials (Use: a / b)");
      }
    }
    else if (userType === "ngo") {
      // NGO Login with API
      if (!id || !pass) {
        setError("Please enter both NGO ID and Password");
        return;
      }

      // Import ngoApi at the top of the file
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

  // Helper to change input label based on selection
  const getInputLabel = () => {
    if (userType === "government") return "Government Agency ID";
    if (userType === "ngo") return "NGO ID";
    return "Volunteer ID";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Login Portal</h2>

        {/* --- THREE SEPARATE BOXES FOR SELECTION --- */}
        {!userType ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Volunteer Login Box */}
            <div
              onClick={() => setUserType("volunteer")}
              className="bg-[#1e293b] p-8 rounded-xl border border-white/10 shadow-xl hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Volunteer</h3>
                <p className="text-gray-400 text-sm">Login as a volunteer to contribute to disaster relief efforts</p>
              </div>
            </div>

            {/* NGO Box */}
            <div
              onClick={() => setUserType("ngo")}
              className="bg-[#1e293b] p-8 rounded-xl border border-white/10 shadow-xl hover:border-purple-500 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NGO</h3>
                <p className="text-gray-400 text-sm">Login for NGO organizations to coordinate relief operations</p>
              </div>
            </div>

            {/* Government Agency Box - Now Last */}
            <div
              onClick={() => navigate("/government-login")}
              className="bg-[#1e293b] p-8 rounded-xl border border-white/10 shadow-xl hover:border-green-500 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Government Agency</h3>
                <p className="text-gray-400 text-sm">Access government portal for disaster management coordination</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1e293b] p-8 rounded-xl max-w-md mx-auto border border-white/10 shadow-xl">
            <button
              onClick={() => { setUserType(""); setAgencyType(""); setError(""); setId(""); setPass(""); }}
              className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to selection
            </button>

            <h3 className="text-xl font-bold text-white mb-6 text-center">
              {userType === "volunteer" && "Volunteer Login"}
              {userType === "government" && "Government Agency Login"}
              {userType === "ngo" && "NGO Login"}
            </h3>

            {/* Agency Type Selector for Government Users */}
            {userType === "government" && (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Select Agency Type
                </label>
                <div className="relative">
                  <select
                    value={agencyType}
                    onChange={(e) => setAgencyType(e.target.value)}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer max-h-48 overflow-y-auto"
                  >
                    <option value="" disabled className="bg-[#1e293b] text-gray-400">
                      -- Choose Agency --
                    </option>
                    <option value="ndrf" className="bg-[#1e293b] text-white py-2">
                      NDRF (National Disaster Response Force)
                    </option>
                    <option value="medical" className="bg-[#1e293b] text-white py-2">
                      Medical Team
                    </option>
                    <option value="fire" className="bg-[#1e293b] text-white py-2">
                      Fire Team
                    </option>
                    <option value="others" className="bg-[#1e293b] text-white py-2">
                      Others
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* NGO ID Selector - Only for NGO users */}
            {userType === "ngo" ? (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Select NGO Account
                </label>
                <div className="relative">
                  <select
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer max-h-48"
                  >
                    <option value="" disabled className="bg-[#1e293b] text-gray-400">
                      -- Select NGO Account --
                    </option>
                    <option value="NGO001" className="bg-[#1e293b] text-white py-2">
                      NGO001 - Red Cross India (Mumbai, Maharashtra)
                    </option>
                    <option value="NGO002" className="bg-[#1e293b] text-white py-2">
                      NGO002 - Care India (Delhi, NCR)
                    </option>
                    <option value="NGO003" className="bg-[#1e293b] text-white py-2">
                      NGO003 - Oxfam India (Bangalore, Karnataka)
                    </option>
                    <option value="NGO004" className="bg-[#1e293b] text-white py-2">
                      NGO004 - Save the Children (Chennai, Tamil Nadu)
                    </option>
                    <option value="NGO005" className="bg-[#1e293b] text-white py-2">
                      NGO005 - Goonj (Kolkata, West Bengal)
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : userType === "volunteer" ? (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Select Volunteer ID
                </label>
                <div className="relative">
                  <select
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#1e293b] text-gray-400">
                      -- Select Volunteer ID --
                    </option>
                    <option value="V001" className="bg-[#1e293b] text-white py-2">
                      V001
                    </option>
                    <option value="V002" className="bg-[#1e293b] text-white py-2">
                      V002
                    </option>
                    <option value="V003" className="bg-[#1e293b] text-white py-2">
                      V003
                    </option>
                    <option value="V004" className="bg-[#1e293b] text-white py-2">
                      V004
                    </option>
                    <option value="V005" className="bg-[#1e293b] text-white py-2">
                      V005
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <input
                placeholder={getInputLabel()}
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
              />
            )}

            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold text-white transition-all"
            >
              Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}