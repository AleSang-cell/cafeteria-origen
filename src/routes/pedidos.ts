import { Router } from 'express';
import { catalogo } from '../data/catalogo';
import { Pedido } from '../models/Pedido';
import { HttpError } from '../middlewares/errorHandler';
import { pedidoService } from '../services/pedidoService';

interface ItemPedidoInput {
  productoId: number;
  cantidad: number;
}

function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validarItems(body: unknown): ItemPedidoInput[] {
  if (!esObjeto(body) || !Array.isArray(body.items) || body.items.length === 0) {
    throw new HttpError(400, 'El pedido debe tener al menos un item');
  }

  return body.items.map((item: unknown) => {
    if (!esObjeto(item)) {
      throw new HttpError(400, 'Cada item debe ser un objeto');
    }

    const { productoId, cantidad } = item;

    if (typeof productoId !== 'number' || !Number.isInteger(productoId) || productoId <= 0) {
      throw new HttpError(400, 'El productoId debe ser un número entero positivo');
    }

    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
      throw new HttpError(400, 'La cantidad debe ser un número entero positivo');
    }

    if (!catalogo.buscarPorId(productoId)) {
      throw new HttpError(400, `Producto inexistente en el catálogo: ${productoId}`);
    }

    return { productoId, cantidad };
  });
}

function pedidoAJson(pedido: Pedido) {
  return {
    id: pedido.id,
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
    const pedido = pedidoService.crearPedido(validarItems(req.body));
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
