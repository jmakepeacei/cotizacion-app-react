import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CotizacionApp.css';
import ExportButton from './ExportButton';

interface Cotizacion {
  id: string;
  fecha: string;
  encabezado: {
    identificador: string;
    nombre: string;
  };
  membrete: {
    imagen: string;
    tipodocumento: string;
    empresa: string;
  };
}

const CotizacionesGuardadas: React.FC = () => {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizacionesGuardadas') || '[]');
    setCotizaciones(cotizacionesGuardadas);
  }, []);

  const verCotizacion = (id: string) => {
    navigate(`/cotizacion/${id}`);
  };

  const eliminarCotizacion = (id: string) => {
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizacionesGuardadas') || '[]');
    const nuevasCotizaciones = cotizacionesGuardadas.filter((cotizacion: Cotizacion) => cotizacion.id !== id);
    localStorage.setItem('cotizacionesGuardadas', JSON.stringify(nuevasCotizaciones));
    setCotizaciones(nuevasCotizaciones);
  };

  return (

    <div className="cotizaciones-guardadas">
      <h1>Documentos Guardados</h1>
      <div className="card">
        <ExportButton />
      </div>
      <div className="lista-cotizaciones">
        {cotizaciones.map((cotizacion) => (
          <div key={cotizacion.id} className="cotizacion-item">
            <div onClick={() => verCotizacion(cotizacion.id)}>
              <div> <img src={cotizacion.membrete.imagen} alt="Logo" className="logo-imagen" /></div>
              <div><b>Tipo Documento: {cotizacion.membrete.tipodocumento}</b></div>
              <div>Empresa: {cotizacion.membrete.empresa}</div>
              <div>Fecha: {new Date(cotizacion.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}</div>
              <div>Identificador: {cotizacion.id}</div>
              <div>Cliente: {cotizacion.encabezado.nombre}</div>
            </div>
            <div style={{ padding: '8px' }}>
              <button onClick={() => eliminarCotizacion(cotizacion.id)} className="btn btn-danger">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')} className="btn btn-primary">Regresar</button>
    </div>
  );
};

export default CotizacionesGuardadas;