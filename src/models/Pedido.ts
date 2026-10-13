import { Producto } from './producto';

export interface ItemPedido {
  producto: Producto;
  cantidad: number;
}

export class Pedido {
  readonly estado = 'pendiente';

  constructor(
    public readonly id: number,
    public readonly items: ItemPedido[],
  ) {}

  calcularTotal(): number {
    return this.items.reduce(
      (suma, item) => suma + item.producto.calcularPrecio() * item.cantidad,
      0,
    );
  }
}
