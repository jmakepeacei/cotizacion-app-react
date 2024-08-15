import React, { useState, useEffect, ChangeEvent } from 'react';
import { jsPDF } from "jspdf";
import { useParams, useNavigate } from 'react-router-dom';
import './CotizacionApp.css'; 
import { imagenDefaultBase64 } from './imagenBase64';
import { callAddFont } from './fontMontserrat';
import { convertirNumeroALetras } from './ConvertirNumerosALetras';

//import { callAddFont } from './fontRoboto';
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

const CotizacionApp: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const fontSize = 8;

    const [idc, setIdc] = useState<string>(Date.now().toString());
    const [imagen, setImagen] = useState<string>(imagenDefaultBase64);
    const [encabezado, setEncabezado] = useState<Encabezado>({
        identificador: '1234576-0',
        nombre: 'Jose Maria Makepeace Moscoso',
        direccion: '11A Sur No.1 Esq 2A Oriente, Tapachula',
        telefono: '5678-1234',
        correo: 'josemakepeace76@gmail.com',
    });

    //const hoy = new Date().toISOString().split('T')[0];
    const hoy = new Date().toISOString().slice(0, 19)
    const [membrete, setMembrete] = useState<Membrete>({
        tipodocumento: 'COTIZACIÓN',
        empresa: 'Alfa Beta',
        direccion: '12 Av. 34-56 Apto 7 Zona 89 col. Alfa Beta Gama',
        telefono: '1234-5678',
        pais: 'Guatemala',
        correo: 'josemakepeace76@gmail.com',
        id: idc,
        fecha: hoy,
        simbolo: 'Q',
        imagen: imagen
    });

    const [productos, setProductos] = useState<Producto[]>([]);
    const totalValorTotal = productos.reduce((total, producto) => total + producto.valorTotal, 0);

    const [nuevoProducto, setNuevoProducto] = useState<Omit<Producto, 'id' | 'valorTotal'>>({
        cantidad: 1,
        descripcion: '',
        valorUnitario: 0
    });
    const [productoEditado, setProductoEditado] = useState<Producto | null>(null);
    const [observaciones, setObservaciones] = useState<string>('');
    const navigate = useNavigate();

    const handleProductoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNuevoProducto({
            ...nuevoProducto,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
        });
    };

    const handleImagenChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                setImagen(base64Image);
                setMembrete((prevMembrete) => ({
                    ...prevMembrete,
                    imagen: base64Image
                }));
            }
            reader.readAsDataURL(file);
        }
    };

    const handleEncabezadoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEncabezado({ ...encabezado, [e.target.name]: e.target.value });
    };

    const handleMembreteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMembrete({ ...membrete, [e.target.name]: e.target.value });
    };

    const agregarProducto = () => {
        if (nuevoProducto.cantidad && nuevoProducto.descripcion && nuevoProducto.valorUnitario) {
            const valorTotal = nuevoProducto.cantidad * nuevoProducto.valorUnitario;

            if (productoEditado) {
                const productosActualizados = productos.map((producto) =>
                    producto.id === productoEditado.id ? { ...productoEditado, ...nuevoProducto, valorTotal } : producto
                );
                setProductos(productosActualizados);
                setProductoEditado(null);
            } else {
                setProductos([...productos, { ...nuevoProducto, id: Date.now(), valorTotal }]);
            }
            setNuevoProducto({ cantidad: 1, descripcion: '', valorUnitario: 0 });
        }
    };

    const editarProducto = (id: number) => {
        const productoParaEditar = productos.find((producto) => producto.id === id);
        if (productoParaEditar) {
            setProductoEditado(productoParaEditar);
            setNuevoProducto(productoParaEditar);
        }
    };

    const eliminarProducto = (id: number) => {
        setProductos(productos.filter(producto => producto.id !== id));
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        callAddFont.call(doc);

        doc.addImage(imagen, 'JPEG', 10, 12, 25, 25);

        let ex = 8;
        let ye = 55;
        let width = 190;
        let height = 17;
        let radius = 2;

        doc.setFont('Montserrat-Regular', 'normal');
        doc.setFontSize(fontSize + 4);
        doc.text(`${membrete.tipodocumento}`, 40, 15);

        doc.setFontSize(fontSize);
        doc.text(`${membrete.empresa}`, 40, 20);
        doc.setFontSize(fontSize + 2);
        doc.text(`Correlativo: ${membrete.id}`, 195, 20, { align: 'right' });
        doc.setFontSize(fontSize);
        doc.text(`${membrete.direccion}`, 40, 25);
        const formatoFecha = new Date(membrete.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
        doc.text(`Fecha: ${formatoFecha}`, 195, 25, { align: 'right' });
        doc.text(`${membrete.telefono}`, 40, 30);
        doc.text(`${membrete.correo}`, 40, 35);
        doc.text(`${membrete.pais}`, 40, 40);

        doc.setFontSize(fontSize);
        doc.setDrawColor(204, 204, 204);
        doc.roundedRect(ex, ye, width, height, radius, radius, 'S');
        doc.text(`ID/NIT/DPI: ${encabezado.identificador}`, 10, 60);
        doc.text(`Nombre: ${encabezado.nombre}`, 50, 60);
        doc.text(`Dirección: ${encabezado.direccion}`, 10, 65);
        doc.text(`Teléfono: ${encabezado.telefono}`, 10, 70);
        doc.text(`Correo: ${encabezado.correo}`, 70, 70);


        ex = 8;
        ye = 73;
        width = 190;
        height = 7;
        radius = 2;
        doc.setFontSize(fontSize);
        doc.roundedRect(ex, ye, width, height, radius, radius, 'S');
        doc.text('Cantidad', 10, 78);
        doc.text('Descripción', 26, 78);
        doc.text('Valor Unitario', 170, 78, { align: 'right' });
        doc.text('Valor Total', 195, 78, { align: 'right' });

        let y = 86;
        let contador = 0;
        let textoLargo = "";
        let textLines = "";
        const maxWidth = 120;
        productos.forEach((producto) => {
            doc.text(producto.cantidad.toString(), 10, y);
            textoLargo = producto.descripcion;
            textLines = doc.splitTextToSize(textoLargo, maxWidth);
            doc.text(textLines, 26, y);
            doc.text(`${membrete.simbolo}` + producto.valorUnitario.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 170, y, { align: 'right' });
            doc.text(`${membrete.simbolo}` + producto.valorTotal.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 195, y, { align: 'right' });
            y += textLines.length * 4;
            contador += 1;

            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });

        ex = 8;
        ye = 81;
        width = 190;
        height = y - ye - 2;
        radius = 2;
        doc.roundedRect(ex, ye, width, height, radius, radius, 'S');

        ex = 8;
        ye = y - 1;
        width = 190;
        height = 16;
        radius = 2;
        doc.roundedRect(ex, ye, width, height, radius, radius, 'S');

        doc.setFontSize(fontSize);
        doc.text('Total en Letras:', 10, y + 3);
        doc.text(`${membrete.simbolo}` + totalValorTotal.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 195, y + 3, { align: 'right' });
        doc.setFontSize(fontSize);


        textoLargo = convertirNumeroALetras(totalValorTotal);
        textLines = doc.splitTextToSize(textoLargo, 170);
        doc.text(textLines, 10, y + 7);

        y = y + 17;
        ex = 8;
        ye = y - 1;
        width = 190;
        height = 25;
        radius = 2;
        doc.roundedRect(ex, ye, width, height, radius, radius, 'S');

        doc.setFontSize(fontSize);
        doc.text('Observaciones:', 10, y + 3);
        doc.setFontSize(fontSize);

        textoLargo = observaciones;
        textLines = doc.splitTextToSize(textoLargo, 170);
        doc.text(textLines, 10, y + 7);

        let xOffset = doc.internal.pageSize.width / 2
        doc.text('Makepeace Corp', xOffset, y + 30, { align: 'center' });

        doc.save('cotizacion.pdf');
    };

    const guardarCotizacion = () => {
        const nuevaCotizacion: Cotizacion = {
            id: membrete.id,
            fecha: membrete.fecha,
            membrete,
            encabezado,
            productos,
            observaciones
        };

        const cotizacionesGuardadas: Cotizacion[] = JSON.parse(localStorage.getItem('cotizacionesGuardadas') || '[]');

        const index = cotizacionesGuardadas.findIndex((cotizacion: Cotizacion) => cotizacion.id === nuevaCotizacion.id);
        if (index !== -1) {
            cotizacionesGuardadas[index] = nuevaCotizacion;
        } else {
            cotizacionesGuardadas.push(nuevaCotizacion);
        }

        localStorage.setItem('cotizacionesGuardadas', JSON.stringify(cotizacionesGuardadas));

        alert('Cotización guardada exitosamente');
    };

    const HandleAddNewDocument = () => {
        setProductos([]);
        setImagen(imagenDefaultBase64);
        const idx = (Date.now().toString());
        setIdc(idx);
        setMembrete({
            ...membrete,
            id: idx,
            fecha: new Date().toISOString().slice(0, 19),
        });
    };

    // useEffect(() => {
    //     const savedData = localStorage.getItem('cotizacionData');
    //     if (savedData) {
    //         const { membrete, encabezado, productos, observaciones } = JSON.parse(savedData);
    //         setMembrete(membrete);
    //         setEncabezado(encabezado);
    //         setProductos(productos);
    //         setObservaciones(observaciones);
    //     }
    // }, []);

    useEffect(() => {
        if (id) {
            const cotizacionesGuardadas: Cotizacion[] = JSON.parse(localStorage.getItem('cotizacionesGuardadas') || '[]');
            const cotizacionSeleccionada = cotizacionesGuardadas.find(cotizacion => cotizacion.id === id);

            if (cotizacionSeleccionada) {
                setIdc(cotizacionSeleccionada.id);
                setMembrete(cotizacionSeleccionada.membrete);
                setEncabezado(cotizacionSeleccionada.encabezado);
                setProductos(cotizacionSeleccionada.productos);
                setObservaciones(cotizacionSeleccionada.observaciones);
                setImagen(cotizacionSeleccionada.membrete.imagen);
            } else {
                alert('Documento no encontrado');
                navigate('/');
            }
        }

    }, [id, navigate]);

    return (
        <div className="cotizacion-app">
            <div className="card">
                <button onClick={() => { navigate('/'); HandleAddNewDocument(); }} className="btn btn-primary">Nuevo Documento</button>
            </div>
            <div className="card imagen-card">
                <img src={imagen} alt="Logo" className="logo-imagen" onClick={() => document.getElementById('imagenInput')?.click()} />
                <input
                    id="imagenInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="hidden-input"
                />
                <div className="contenedor">
                    <div className="grid-1">
                        <input className="input-telefono" placeholder="Tipo de Documento" name="tipodocumento" value={membrete.tipodocumento} onChange={handleMembreteChange} />
                        <input className="input-empresa" placeholder="Empresa" name="empresa" value={membrete.empresa} onChange={handleMembreteChange} />
                        <input className="input-direccion" placeholder="Direccion" name="direccion" value={membrete.direccion} onChange={handleMembreteChange} />
                        <input className="input-telefono" placeholder="Telefono" name="telefono" value={membrete.telefono} onChange={handleMembreteChange} />
                        <input className="input-pais" placeholder="Pais" name="pais" value={membrete.pais} onChange={handleMembreteChange} />
                        <input className="input-correo" placeholder="Correo" name="correo" value={membrete.correo} onChange={handleMembreteChange} />
                        <input className="input-telefono" placeholder="Correlativo" name="correlativo" value={membrete.id} onChange={handleMembreteChange} />
                        <input className="input-correo" placeholder="Fecha" name="fecha" type="datetime-local" value={membrete.fecha} onChange={handleMembreteChange} />
                        <input className="input-pais" placeholder="Simbolo Moneda" name="simbolo" value={membrete.simbolo} onChange={handleMembreteChange} />
                    </div>
                </div>
            </div>

            <div className="card">
                <h2>Encabezado</h2>
                <div className="grid-2">
                    <input className="input-identificador" placeholder="ID/NIT/DPI" name="identificador" value={encabezado.identificador} onChange={handleEncabezadoChange} />
                    <input className="input-nombre" placeholder="Nombre" name="nombre" value={encabezado.nombre} onChange={handleEncabezadoChange} />
                    <input className="input-direccion" placeholder="Dirección" name="direccion" value={encabezado.direccion} onChange={handleEncabezadoChange} />
                    <input className="input-telefono" placeholder="Teléfono" name="telefono" value={encabezado.telefono} onChange={handleEncabezadoChange} />
                    <input className="input-correo" placeholder="Correo" name="correo" value={encabezado.correo} onChange={handleEncabezadoChange} />
                </div>
            </div>

            <div className="card">
                <h2>Detalle</h2>
                <div className="grid-4">
                    <input className="input-cantidad" placeholder="Cantidad" name="cantidad" value={nuevoProducto.cantidad} onChange={handleProductoChange} type="number" />
                    <textarea rows={1} className="input-descripcion" placeholder="Descripción" name="descripcion" value={nuevoProducto.descripcion} onChange={handleProductoChange} />
                    <input className="input-valorunitario" placeholder="Valor Unitario" step="0.01" name="valorUnitario" value={nuevoProducto.valorUnitario} onChange={handleProductoChange} type="number" />
                    <button onClick={agregarProducto} className="btn btn-primary">{productoEditado ? 'Actualizar' : 'Agregar'}</button>
                </div>
                <div className="productos-lista">
                    {productos.map((producto, index) => (
                        <div key={index} className="grid-5">
                            <div>{producto.cantidad}</div>
                            <div>{producto.descripcion}</div>
                            <div>{producto.valorUnitario}</div>
                            <div>{membrete.simbolo}{producto.valorTotal.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <button onClick={() => editarProducto(producto.id)} className="btn btn-warning">Editar</button>
                            <button onClick={() => eliminarProducto(producto.id)} className="btn btn-danger">Eliminar</button>
                        </div>
                    ))}

                    <div className="grid-5 total-row">
                        <div></div>
                        <div></div>
                        <div><strong>Total:</strong></div>
                        <div><strong>{membrete.simbolo}{totalValorTotal.toFixed(2)}</strong></div>
                        <div></div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2>Observaciones</h2>
                <textarea
                    placeholder="Observaciones"
                    value={observaciones}
                    rows={5}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setObservaciones(e.target.value)}
                />
            </div>

            <div className="card buttons-card">
                <button onClick={generarPDF} className="btn btn-primary btn-full">Generar PDF</button>
                <button onClick={guardarCotizacion} className="btn btn-danger btn-full">Guardar Cotización</button>
                <button onClick={() => navigate('/cotizaciones')} className="btn btn-secondary btn-full">Ver Cotizaciones Guardadas</button>
            </div>
        </div>
    );
};

export default CotizacionApp;