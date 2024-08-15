import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CotizacionApp from './CotizacionApp';
import CotizacionesGuardadas from './CotizacionesGuardadas';
import './App.css';

function App() {
  return (
    <Router basename="/cotizacion-app-react">
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/cotizacion-app-react" />} />   
          <Route path="/cotizaciones" element={<CotizacionesGuardadas />} />       
          <Route path="/cotizacion/:id" element={<CotizacionApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
