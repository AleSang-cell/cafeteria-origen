import { Pedido, ItemPedido } from '../models/Pedido';
import { catalogo } from '../data/catalogo';

interface ItemPedidoInput {
  productoId: number;
  cantidad: number;
}

class PedidoService {
  private pedidos: Pedido[] = [];
  private siguienteId = 1;

  crearPedido(items: ItemPedidoInput[]): Pedido {
    if (items.length === 0) {
      throw new Error('El pedido debe tener al menos un item');
    }

    const itemsResueltos: ItemPedido[] = items.map(({ productoId, cantidad }) => {
      if (cantidad <= 0) {
        throw new Error(`Cantidad inválida: ${cantidad}`);
      }

      const producto = catalogo.buscarPorId(productoId);
      if (!producto) {
        throw new Error(`Producto inexistente en el catálogo: ${productoId}`);
      }

      return { producto, cantidad };
    });

    const pedido = new Pedido(this.siguienteId++, itemsResueltos);
    this.pedidos.push(pedido);
    return pedido;
  }

  listar(): Pedido[] {
    return [...this.pedidos];
  }

  buscarPorId(id: number): Pedido | undefined {
    return this.pedidos.find((p) => p.id === id);
  }

  reset(): void {
    this.pedidos = [];
    this.siguienteId = 1;
  }
}

export const pedidoService = new PedidoService();
