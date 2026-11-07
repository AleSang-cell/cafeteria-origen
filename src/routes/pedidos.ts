import { Router } from 'express';
import { Pedido } from '../models/Pedido';
import { HttpError } from '../middlewares/errorHandler';
import { pedidoService } from '../services/pedidoService';
import { validarItems, validarMesa } from '../validators/pedidoValidator';

function pedidoAJson(pedido: Pedido) {
  return {
    id: pedido.id,
    mesaId: pedido.mesaId,
    estado: pedido.estado,
    items: pedido.items.map(({ producto, cantidad }) => ({
      productoId: producto.id,
      cantidad,
    })),
    total: pedido.calcularTotal(),
  };
}

export const pedidosRouter = Router();

pedidosRouter.post('/', (req, res, next) => {
  try {
    const items = validarItems(req.body);
    const mesaId = validarMesa(req.body);
    const pedido = pedidoService.crearPedido(items, mesaId);
    res.status(201).json(pedidoAJson(pedido));
  } catch (error) {
    next(error);
  }
});

pedidosRouter.get('/', (_req, res) => {
  res.json(pedidoService.listar().map(pedidoAJson));
});

pedidosRouter.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const pedido = Number.isInteger(id) && id > 0 ? pedidoService.buscarPorId(id) : undefined;

  if (!pedido) {
    next(new HttpError(404, `Pedido no encontrado: ${req.params.id}`));
    return;
  }

  res.json(pedidoAJson(pedido));
});