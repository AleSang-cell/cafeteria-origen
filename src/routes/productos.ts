import { Router } from 'express';
import { catalogo } from '../data/catalogo';
import { Producto } from '../models/producto';
import { Cafe } from '../models/cafe';
import { Expreso } from '../models/expreso';

export type TipoProducto = 'expreso' | 'filtrado' | 'pasteleria';

// El front distingue los productos por este campo, sin leer el nombre.
function tipoDe(producto: Producto): TipoProducto {
  if (producto instanceof Cafe) {
    return producto instanceof Expreso ? 'expreso' : 'filtrado';
  }
  return 'pasteleria';
}

// Los datos propios de un café: tamaño y variedad con su descripción.
function datosDeCafe(cafe: Cafe) {
  return {
    tamanio: cafe.tamanio.nombre,
    variedad: {
      nombre: cafe.variedad.nombre,
      descripcion: cafe.variedad.descripcion,
    },
  };
}

// Arma la respuesta JSON de un producto con su precio ya calculado.
export function productoAJson(producto: Producto) {
  const base = {
    id: producto.id,
    tipo: tipoDe(producto),
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
  };

  return producto instanceof Cafe ? { ...base, ...datosDeCafe(producto) } : base;
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