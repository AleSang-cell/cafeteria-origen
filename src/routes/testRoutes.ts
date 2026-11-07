import { Router } from 'express';
import { pedidoService } from '../services/pedidoService';

// Rutas para los tests E2E: dejan la API en un estado conocido.
export const testRouter = Router();

testRouter.use((_req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    next('router');
    return;
  }
  next();
});

testRouter.post('/reset', (_req, res) => {
  pedidoService.reset();
  res.status(204).end();
});

testRouter.post('/seed', (_req, res) => {
  pedidoService.reset();
  pedidoService.crearPedido(
    [
      { productoId: 9, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
    4,
  );
  res.status(201).end();
});