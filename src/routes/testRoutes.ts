import { Router } from 'express';
import { pedidoService } from '../services/pedidoService';

// Rutas para los tests E2E: dejan la API en un estado conocido.
export const testRouter = Router();

testRouter.post('/reset', (_req, res) => {
  pedidoService.reset();
  res.status(204).end();
});