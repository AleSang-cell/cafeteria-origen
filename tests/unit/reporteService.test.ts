import { describe, it, expect, beforeEach } from 'vitest';
import { reporteService } from '../../src/services/reporteService';
import { pedidoService } from '../../src/services/pedidoService';

// Ids del catálogo usados en los tests (ver src/data/catalogo.ts):
// 1  = Expreso Pocillo Brasil   -> 5020
// 2  = Filtrado Pocillo Brasil  -> 4040
// 3  = Expreso Pocillo Colombia -> 5740
// 19 = Muffin de chocolate      -> 2500

describe('reporteService', () => {
  beforeEach(() => {
    pedidoService.reset();
  });

  describe('facturacionTotal', () => {
    it('da 0 si no hay pedidos', () => {
      expect(reporteService.facturacionTotal()).toBe(0);
    });

    it('suma los totales de todos los pedidos', () => {
      pedidoService.crearPedido([{ productoId: 1, cantidad: 2 }]); // 10040
      pedidoService.crearPedido([
        { productoId: 2, cantidad: 1 }, // 4040
        { productoId: 19, cantidad: 3 }, // 7500
      ]);

      expect(reporteService.facturacionTotal()).toBe(21580);
    });
  });
});