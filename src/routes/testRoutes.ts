import { Router, RequestHandler } from 'express';
import { pedidoService } from '../services/pedidoService';

// Rutas para los tests E2E: dejan la API en un estado conocido.
// Solo responden con NODE_ENV=test; en cualquier otro entorno no existen.

// Ids del catálogo (ver src/data/catalogo.ts)
const EXPRESO_MEDIANO_COLOMBIA = 9;
const MUFFIN = 19;

// El pedido del enunciado: mesa 4, dos expresos medianos de Colombia
// y un muffin, total 17220.
const PEDIDO_DE_EJEMPLO = {
  mesaId: 4,
  items: [
    { productoId: EXPRESO_MEDIANO_COLOMBIA, cantidad: 2 },
    { productoId: MUFFIN, cantidad: 1 },
  ],
};

// La variable se lee en cada request (y no al arrancar) para que los
// tests puedan cambiarla con vi.stubEnv.
const soloEnModoTest: RequestHandler = (_req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    next('router');
    return;
  }
  next();
};

export const testRouter = Router();

testRouter.use(soloEnModoTest);

testRouter.post('/reset', (_req, res) => {
  pedidoService.reset();
  res.status(204).end();
});

testRouter.post('/seed', (_req, res) => {
  pedidoService.reset();
  pedidoService.crearPedido(PEDIDO_DE_EJEMPLO.items, PEDIDO_DE_EJEMPLO.mesaId);
  res.status(201).end();
});