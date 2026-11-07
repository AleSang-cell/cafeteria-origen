import { describe, it, expect } from 'vitest';
import { Pedido } from '../../src/models/Pedido';
import { Expreso } from '../../src/models/expreso';
import { Pasteleria } from '../../src/models/pasteleria';
import { Variedad } from '../../src/models/variedad';
import { Tamanio } from '../../src/models/tamanio';

const expresoBrasilPocillo = new Expreso(1, new Variedad('Brasil'), new Tamanio('Pocillo')); // 5020
const muffin = new Pasteleria(19, 'Muffin de chocolate', 2500);

describe('Pedido', () => {
  it('se crea con id, items y estado pendiente', () => {
    const pedido = new Pedido(1, [{ producto: expresoBrasilPocillo, cantidad: 2 }]);

    expect(pedido.id).toBe(1);
    expect(pedido.items).toHaveLength(1);
    expect(pedido.items[0].producto).toBe(expresoBrasilPocillo);
    expect(pedido.items[0].cantidad).toBe(2);
    expect(pedido.estado).toBe('pendiente');
  });

  it('calcularTotal suma precio × cantidad de cada item', () => {
    const pedido = new Pedido(1, [
      { producto: expresoBrasilPocillo, cantidad: 2 }, // 5020 × 2 = 10040
      { producto: muffin, cantidad: 3 }, // 2500 × 3 = 7500
    ]);

    expect(pedido.calcularTotal()).toBe(17540);
  });

  it('calcularTotal es 0 sin items', () => {
    const pedido = new Pedido(1, []);

    expect(pedido.calcularTotal()).toBe(0);
  });
});
