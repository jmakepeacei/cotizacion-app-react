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

export const convertToCSV = (cotizaciones: Cotizacion[]) => {
    const headers = [
        'ID', 'Fecha', 'Identificador', 'Nombre Cliente', 'Direccion', 'Telefono', 'Correo',
        'Producto Descripción', 'Producto Cantidad', 'Producto Precio Unitario', 'Producto Total',
        'Observaciones'
    ];

    const csvRows = [headers.join(',')];

    cotizaciones.forEach(cotizacion => {
        cotizacion.productos.forEach(producto => {

            const row = [
                cotizacion.id,
                new Date(cotizacion.fecha).toLocaleString(), // Fecha completa con hora
                cotizacion.encabezado.identificador,
                cotizacion.encabezado.nombre,
                cotizacion.encabezado.direccion,
                cotizacion.encabezado.telefono,
                cotizacion.encabezado.correo,
                producto.descripcion,
                producto.cantidad.toString(),
                producto.valorUnitario.toFixed(2),
                producto.valorTotal.toFixed(2),
                cotizacion.observaciones
            ];

            csvRows.push(row.join(','));
        });
    });

    return csvRows.join('\n');
};
