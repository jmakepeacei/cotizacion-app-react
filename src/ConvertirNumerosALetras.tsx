const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const especiales = [
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
    'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
];
const decenas = [
    'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta',
    'setenta', 'ochenta', 'noventa'
];
const centenas = [
    'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
];

export function convertirNumeroALetras(valor: number): string {
    if (valor === 0) return 'cero';

    let enteros = Math.floor(valor);
    let centavos = Math.round((valor - enteros) * 100);

    let letras = '';

    if (enteros >= 1000000) {
        const millones = Math.floor(enteros / 1000000);
        letras += `${millones === 1 ? 'un millón' : convertirNumeroALetras(millones) + ' millones'} `;
        enteros %= 1000000;
    }

    if (enteros >= 1000) {
        const miles = Math.floor(enteros / 1000);
        letras += `${miles === 1 ? '' : convertirNumeroALetras(miles)} mil `;
        enteros %= 1000;
    }

    if (enteros >= 100) {
        const cientos = Math.floor(enteros / 100);
        letras += `${cientos === 1 && enteros % 100 === 0 ? 'cien' : centenas[cientos - 1]} `;
        enteros %= 100;
    }

    if (enteros >= 20) {
        const decena = Math.floor(enteros / 10);
        letras += `${decenas[decena - 2]}`;
        if (enteros % 10 !== 0) {
            letras += ` y ${unidades[enteros % 10]}`;
        }
    } else if (enteros >= 10) {
        letras += especiales[enteros - 10];
    } else if (enteros > 0) {
        letras += unidades[enteros];
    }

    if (centavos > 0) {
        letras += ` con ${centavos}/100 centavos`;
    }

    return letras.trim();
}
