import { Router } from 'express';
import { catalogo } from '../data/catalogo';
import { Producto } from '../models/producto';
import { Cafe } from '../models/cafe';

// Arma la respuesta JSON de un producto con su precio ya calculado.
// Los cafés agregan variedad y tamaño; la pastelería no los tiene.
export function productoAJson(producto: Producto) {
  const base = {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
  };

  if (producto instanceof Cafe) {
    return { ...base, variedad: producto.variedad.nombre, tamanio: producto.tamanio.nombre };
  }

  return base;
}

export const productosRouter = Router();

productosRouter.get('/', (_req, res) => {
  res.json(catalogo.listar().map(productoAJson));
});

productosRouter.get('/:id', (req, res) => {
  const producto = catalogo.buscarPorId(Number(req.params.id));

  if (!producto) {
    res.status(404).json({ error: `Producto no encontrado: ${req.params.id}` });
    return;
  }

  res.json(productoAJson(producto));
});