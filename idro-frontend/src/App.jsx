import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the components
import IdroHome from './components/IdroHome';
import CommandCenter from './components/IdroHome';
import ResponseDashboard from './components/ResponseDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Entry Point (Single Page Feel) */}
        <Route path="/" element={<IdroHome />} />
        
        {/* Helper routes for specific tasks */}
        <Route path="/command" element={<IdroHome />} />
        <Route path="/response" element={<ResponseDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;