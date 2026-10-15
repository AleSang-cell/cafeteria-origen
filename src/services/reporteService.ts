import { pedidoService } from './pedidoService';

class ReporteService {
  // Reutiliza calcularTotal() de cada Pedido: los precios se calculan en un
  // solo lugar (el modelo), así que el reporte no puede quedar desfasado.
  facturacionTotal(): number {
    return pedidoService
      .listar()
      .reduce((suma, pedido) => suma + pedido.calcularTotal(), 0);
  }
}

export const reporteService = new ReporteService();