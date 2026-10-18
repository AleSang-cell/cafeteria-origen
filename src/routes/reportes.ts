import { Router } from 'express';
import { reporteService } from '../services/reporteService';

export const reportesRouter = Router();

reportesRouter.get('/facturacion', (_req, res) => {
  res.json({ facturacionTotal: reporteService.facturacionTotal() });
});

reportesRouter.get('/mas-vendido', (_req, res) => {
  res.json({ masVendido: reporteService.masVendido() });
});
