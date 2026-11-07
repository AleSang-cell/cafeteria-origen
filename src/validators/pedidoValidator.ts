import { catalogo } from '../data/catalogo';
import { HttpError } from '../middlewares/errorHandler';
import type { ItemPedidoInput } from '../services/pedidoService';

// Valida el cuerpo de POST /pedidos antes de que llegue al service.
// Cualquier dato inválido corta con un HttpError 400, que el errorHandler
// responde con el formato { error }.

// Mesas de la cafetería: decisión del grupo, documentada en el README.
const MESA_MINIMA = 1;
const MESA_MAXIMA = 12;

function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validarItems(body: unknown): ItemPedidoInput[] {
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

function esMesaValida(mesaId: unknown): mesaId is number {
  return (
    typeof mesaId === 'number' &&
    Number.isInteger(mesaId) &&
    mesaId >= MESA_MINIMA &&
    mesaId <= MESA_MAXIMA
  );
}

// Si no viene mesa (o viene null), el pedido es para retirar en la barra.
export function validarMesa(body: unknown): number | null {
  if (!esObjeto(body) || body.mesaId === undefined || body.mesaId === null) {
    return null;
  }

  const { mesaId } = body;

  if (!esMesaValida(mesaId)) {
    throw new HttpError(400, `Mesa inexistente: ${String(mesaId)}`);
  }

  return mesaId;
}