import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (id === "a" && pass === "b") {
      navigate("/volunteer-form");
    } else {
      setError("Invalid Volunteer ID or Password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="bg-[#1e293b] p-8 rounded-xl w-full max-w-md border border-white/10 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Volunteer Login</h2>

        <input
          placeholder="Volunteer ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full mb-4 p-3 bg-black/40 border border-white/10 rounded text-white"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
