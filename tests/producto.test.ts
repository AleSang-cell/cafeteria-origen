import { describe, it, expect } from 'vitest';
import { Producto } from '../src/models/producto';

class ProductoSinPrecio extends Producto {}

describe('Producto', () => {
  it('no se puede instanciar directamente', () => {
    const ProductoDirecto = Producto as unknown as new (
      id: number,
      nombre: string,
      precioBase: number,
    ) => Producto;

    expect(() => new ProductoDirecto(1, 'Genérico', 100)).toThrow('Producto es abstracta');
  });

  it('lanza error si se llama a calcularPrecio() de la clase base', () => {
    const producto = new ProductoSinPrecio(1, 'Sin precio', 100);

    expect(() => producto.calcularPrecio()).toThrow('calcularPrecio() debe implementarse');
  });

  it('guarda id, nombre y precioBase', () => {
    const producto = new ProductoSinPrecio(7, 'Algo', 1500);

    expect(producto.id).toBe(7);
    expect(producto.nombre).toBe('Algo');
    expect(producto.precioBase).toBe(1500);
  });
});