import { convertToCSV } from "./ConvertToCSV";

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

export const exportToCSV = (cotizaciones: Cotizacion[]) => {
    const csvData = convertToCSV(cotizaciones);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'cotizaciones.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
