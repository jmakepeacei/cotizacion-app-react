import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CotizacionApp from './CotizacionApp';
import CotizacionesGuardadas from './CotizacionesGuardadas';
import './App.css';

function App() {
  return (
    <Router basename="/cotizacion-app-react">
      <div className="App">
        <Routes>
          <Route path="/" element={<CotizacionApp />} />   
          <Route path="/cotizaciones" element={<CotizacionesGuardadas />} />       
          <Route path="/cotizacion/:id" element={<CotizacionApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
