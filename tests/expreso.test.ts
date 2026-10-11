import { describe, it, expect } from 'vitest';
import { Expreso } from '../src/models/expreso';
import { Producto } from '../src/models/producto';
import { Variedad } from '../src/models/variedad';
import { Tamanio } from '../src/models/tamanio';

describe('Expreso', () => {
  it.each([
    { tamanio: 'Pocillo', variedad: 'Brasil', esperado: 5020 },
    { tamanio: 'Pocillo', variedad: 'Colombia', esperado: 5740 },
    { tamanio: 'Pocillo', variedad: 'Etiopía', esperado: 6820 },
    { tamanio: 'Mediano', variedad: 'Brasil', esperado: 6280 },
    { tamanio: 'Mediano', variedad: 'Colombia', esperado: 7360 },
    { tamanio: 'Mediano', variedad: 'Etiopía', esperado: 8980 },
    { tamanio: 'Taza grande', variedad: 'Brasil', esperado: 7540 },
    { tamanio: 'Taza grande', variedad: 'Colombia', esperado: 8980 },
    { tamanio: 'Taza grande', variedad: 'Etiopía', esperado: 11140 },
  ])('$tamanio $variedad cuesta $esperado', ({ tamanio, variedad, esperado }) => {
    const expreso = new Expreso(1, new Variedad(variedad), new Tamanio(tamanio));

    expect(expreso.calcularPrecio()).toBe(esperado);
  });

  it('tiene precioBase 2500 y es un Producto', () => {
    const expreso = new Expreso(1, new Variedad('Brasil'), new Tamanio('Pocillo'));

    expect(expreso.precioBase).toBe(2500);
    expect(expreso.nombre).toBe('Expreso');
    expect(expreso).toBeInstanceOf(Producto);
  });
});