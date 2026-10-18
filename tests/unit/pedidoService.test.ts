import { describe, it, expect, beforeEach } from 'vitest';
import { pedidoService } from '../../src/services/pedidoService';
import { Expreso } from '../../src/models/expreso';
import { Pasteleria } from '../../src/models/pasteleria';
import { Variedad } from '../../src/models/variedad';
import { Tamanio } from '../../src/models/tamanio';

const expresoBrasilPocillo = new Expreso(1, new Variedad('Brasil'), new Tamanio('Pocillo')); // 5020
const muffin = new Pasteleria(19, 'Muffin de chocolate', 2500);

describe('pedidoService', () => {
  beforeEach(() => {
    pedidoService.reset();
  });

  it('crearPedido guarda un pedido con ids autoincrementales y estado pendiente', () => {
    const primero = pedidoService.crearPedido([{ productoId: 1, cantidad: 2 }]);
    const segundo = pedidoService.crearPedido([{ productoId: 19, cantidad: 1 }]);

    expect(primero.id).toBe(1);
    expect(segundo.id).toBe(2);
    expect(primero.estado).toBe('pendiente');
    expect(primero.items[0].producto).toBeInstanceOf(Expreso);
    expect(primero.items[0].producto.id).toBe(1);
    expect(primero.items[0].cantidad).toBe(2);
    expect(pedidoService.listar()).toHaveLength(2);
  });

  it('crearPedido calcula el total con los precios del catálogo', () => {
    const pedido = pedidoService.crearPedido([
      { productoId: 1, cantidad: 2 }, // 5020 × 2 = 10040
      { productoId: 19, cantidad: 3 }, // 2500 × 3 = 7500
    ]);

    expect(pedido.calcularTotal()).toBe(17540);
  });

  it('crearPedido rechaza items vacíos', () => {
    expect(() => pedidoService.crearPedido([])).toThrow();
  });

  it('crearPedido rechaza cantidades menores o iguales a 0', () => {
    expect(() => pedidoService.crearPedido([{ productoId: 1, cantidad: 0 }])).toThrow();
    expect(() => pedidoService.crearPedido([{ productoId: 1, cantidad: -2 }])).toThrow();
  });

  it('crearPedido rechaza ids de producto que no existen en el catálogo', () => {
    expect(() => pedidoService.crearPedido([{ productoId: 999, cantidad: 1 }])).toThrow();
  });

  it('buscarPorId devuelve el pedido creado o undefined', () => {
    const pedido = pedidoService.crearPedido([{ productoId: 1, cantidad: 1 }]);

    expect(pedidoService.buscarPorId(pedido.id)).toBe(pedido);
    expect(pedidoService.buscarPorId(999)).toBeUndefined();
  });

  it('reset vacía los pedidos guardados', () => {
    pedidoService.crearPedido([{ productoId: 1, cantidad: 1 }]);
    pedidoService.crearPedido([{ productoId: 2, cantidad: 1 }]);

    pedidoService.reset();

    expect(pedidoService.listar()).toHaveLength(0);
  });
});
