import { describe, it, expect } from 'vitest';
import { catalogo } from '../../src/data/catalogo';
import { Cafe } from '../../src/models/cafe';
import { Expreso } from '../../src/models/expreso';
import { Pasteleria } from '../../src/models/pasteleria';

describe('catálogo', () => {
  it('lista 20 productos: 18 cafés y 2 pastelerías', () => {
    const productos = catalogo.listar();

    expect(productos).toHaveLength(20);
    expect(productos.filter((p) => p instanceof Cafe)).toHaveLength(18);
    expect(productos.filter((p) => p instanceof Pasteleria)).toHaveLength(2);
  });

  it('cubre las 9 combinaciones de Expreso y las 9 de Filtrado sin repetir', () => {
    const esperadas = [
      'Expreso|Mediano|Brasil',
      'Expreso|Mediano|Colombia',
      'Expreso|Mediano|Etiopía',
      'Expreso|Pocillo|Brasil',
      'Expreso|Pocillo|Colombia',
      'Expreso|Pocillo|Etiopía',
      'Expreso|Taza grande|Brasil',
      'Expreso|Taza grande|Colombia',
      'Expreso|Taza grande|Etiopía',
      'Filtrado|Mediano|Brasil',
      'Filtrado|Mediano|Colombia',
      'Filtrado|Mediano|Etiopía',
      'Filtrado|Pocillo|Brasil',
      'Filtrado|Pocillo|Colombia',
      'Filtrado|Pocillo|Etiopía',
      'Filtrado|Taza grande|Brasil',
      'Filtrado|Taza grande|Colombia',
      'Filtrado|Taza grande|Etiopía',
    ];

    const obtenidas = catalogo
      .listar()
      .filter((p): p is Cafe => p instanceof Cafe)
      .map(
        (c) =>
          `${c instanceof Expreso ? 'Expreso' : 'Filtrado'}|${c.tamanio.nombre}|${c.variedad.nombre}`,
      )
      .sort();

    expect(obtenidas).toEqual(esperadas);
  });

  it('incluye las 2 pastelerías exactas con su precio final', () => {
    const pastelerias = catalogo
      .listar()
      .filter((p): p is Pasteleria => p instanceof Pasteleria)
      .map((p) => ({ nombre: p.nombre, precio: p.calcularPrecio() }));

    expect(pastelerias).toEqual([
      { nombre: 'Muffin de chocolate', precio: 2500 },
      { nombre: 'Torta selva negra', precio: 4200 },
    ]);
  });

  it('asigna ids únicos a los 20 productos', () => {
    const ids = catalogo.listar().map((p) => p.id);

    expect(new Set(ids).size).toBe(20);
  });

  it('buscarPorId devuelve el producto que tiene ese id', () => {
    const primerProducto = catalogo.listar()[0];

    expect(catalogo.buscarPorId(primerProducto.id)).toBe(primerProducto);
  });

  it('buscarPorId devuelve undefined si el id no existe', () => {
    expect(catalogo.buscarPorId(-1)).toBeUndefined();
  });
});
