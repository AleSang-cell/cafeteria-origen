import { describe, it, expect } from 'vitest';
import { Filtrado } from '../src/models/filtrado';
import { Producto } from '../src/models/producto';
import { Variedad } from '../src/models/variedad';
import { Tamanio } from '../src/models/tamanio';

describe('Filtrado', () => {
  it.each([
    { tamanio: 'Pocillo', variedad: 'Brasil', esperado: 4040 },
    { tamanio: 'Pocillo', variedad: 'Colombia', esperado: 4280 },
    { tamanio: 'Pocillo', variedad: 'Etiopía', esperado: 4640 },
    { tamanio: 'Mediano', variedad: 'Brasil', esperado: 5300 },
    { tamanio: 'Mediano', variedad: 'Colombia', esperado: 5900 },
    { tamanio: 'Mediano', variedad: 'Etiopía', esperado: 6800 },
    { tamanio: 'Taza grande', variedad: 'Brasil', esperado: 6700 },
    { tamanio: 'Taza grande', variedad: 'Colombia', esperado: 7700 },
    { tamanio: 'Taza grande', variedad: 'Etiopía', esperado: 9200 },
  ])('$tamanio $variedad cuesta $esperado', ({ tamanio, variedad, esperado }) => {
    const filtrado = new Filtrado(1, new Variedad(variedad), new Tamanio(tamanio));

    expect(filtrado.calcularPrecio()).toBe(esperado);
  });

  it('tiene precioBase 3200 y es un Producto', () => {
    const filtrado = new Filtrado(1, new Variedad('Brasil'), new Tamanio('Pocillo'));

    expect(filtrado.precioBase).toBe(3200);
    expect(filtrado.nombre).toBe('Filtrado');
    expect(filtrado).toBeInstanceOf(Producto);
  });
});