import React from 'react';
import { exportToCSV } from './ExportToCSV';

interface Encabezado {
    identificador: string;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
}

interface Membrete {
    tipodocumento: string;
    empresa: string;
    direccion: string;
    telefono: string;
    pais: string;
    correo: string;
    id: string;
    fecha: string;
    simbolo: string;
    imagen: string;
}

interface Producto {
    id: number;
    cantidad: number;
    descripcion: string;
    valorUnitario: number;
    valorTotal: number;
}

interface Cotizacion {
    id: string;
    fecha: string;
    membrete: Membrete;
    encabezado: Encabezado;
    productos: Producto[];
    observaciones: string;
}

const ExportButton: React.FC = () => {
    const handleExport = () => {
        const cotizaciones: Cotizacion[] = JSON.parse(localStorage.getItem('cotizacionesGuardadas') || '[]');
        exportToCSV(cotizaciones);
    };

    return (
        <button onClick={handleExport} className="btn btn-primary">
            Exportar Cotizaciones a CSV
        </button>
    );
};

export default ExportButton;
