import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ActiveDisasters from './pages/ActiveDisasters';
import DisasterDetails from './pages/DisasterDetails';
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerForm from "./pages/VolunteerForm";
import ImpactList from "./pages/ImpactList";
import DisasterAnalyzer from "./pages/DisasterAnalyzer";
import MissionControl from "./pages/MissionControl";

// Import the components
import IdroHome from './components/IdroHome';

function App() {
  return (
    <Router>
   <Routes>
  {/* Main pages */}
  <Route path="/" element={<IdroHome />} />
  <Route path="/command" element={<IdroHome />} />

  {/* Disaster flow */}
  <Route path="/active-disasters" element={<ActiveDisasters />} />
  <Route path="/disaster/:id" element={<DisasterDetails />} />

  {/* Volunteer flow */}
  <Route path="/login" element={<VolunteerLogin />} />
  <Route path="/volunteer-form" element={<VolunteerForm />} />

<Route path="/impact-analysis" element={<ImpactList />} />

  <Route path="/impact-analysis/:id" element={<DisasterAnalyzer />} />

  <Route path="/mission-control" element={<MissionControl />} />


</Routes>



    </Router>
  );
}

export default App;