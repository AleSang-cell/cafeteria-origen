import { pedidoService } from './pedidoService';

export type CantidadPorProducto = Record<string, number>;

export interface MasVendido {
  productos: string[];
  cantidad: number;
}

class ReporteService {
  // Reutiliza calcularTotal() de cada Pedido: los precios se calculan en un
  // solo lugar (el modelo), así que el reporte no puede quedar desfasado.
  facturacionTotal(): number {
    return pedidoService
      .listar()
      .reduce((suma, pedido) => suma + pedido.calcularTotal(), 0);
  }

  // Agrupa por nombre del producto: los cafés se agrupan por máquina
  // ("Expreso", "Filtrado") y la pastelería por su nombre.
  cantidadVendidaPorProducto(): CantidadPorProducto {
    const conteo: CantidadPorProducto = {};

    for (const pedido of pedidoService.listar()) {
      for (const { producto, cantidad } of pedido.items) {
        conteo[producto.nombre] = (conteo[producto.nombre] ?? 0) + cantidad;
      }
    }

    return conteo;
  }

  // Se calcula a partir de cantidadVendidaPorProducto().
  // Sin ventas devuelve null; si hay empate devuelve todos los empatados.
  masVendido(): MasVendido | null {
    const conteo = Object.entries(this.cantidadVendidaPorProducto());

    if (conteo.length === 0) {
      return null;
    }

    const maximo = Math.max(...conteo.map(([, cantidad]) => cantidad));
    const productos = conteo
      .filter(([, cantidad]) => cantidad === maximo)
      .map(([nombre]) => nombre);

    return { productos, cantidad: maximo };
  }
}

export const reporteService = new ReporteService();