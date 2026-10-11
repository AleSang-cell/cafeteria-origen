import { describe, it, expect } from 'vitest';
import { Pasteleria } from '../src/models/pasteleria';
import { Producto } from '../src/models/producto';

describe('Pasteleria', () => {
  it.each([
    { nombre: 'Muffin de chocolate', precioBase: 2500, esperado: 2500 },
    { nombre: 'Torta selva negra', precioBase: 4200, esperado: 4200 },
  ])('$nombre cuesta $esperado', ({ nombre, precioBase, esperado }) => {
    expect(new Pasteleria(1, nombre, precioBase).calcularPrecio()).toBe(esperado);
  });

  it('es un Producto', () => {
    expect(new Pasteleria(1, 'Muffin de chocolate', 2500)).toBeInstanceOf(Producto);
  });
});