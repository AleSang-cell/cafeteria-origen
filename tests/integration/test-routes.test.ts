import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { pedidoService } from '../../src/services/pedidoService';

// Rutas que usan los E2E para arrancar siempre con los mismos datos.
// Solo existen con NODE_ENV=test: vi.stubEnv cambia la variable en cada test.

const MUFFIN = 19;

describe('rutas de test', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    pedidoService.reset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('POST /__test__/reset borra los pedidos y responde 204', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: MUFFIN, cantidad: 1 }] });

    const respuesta = await request(app).post('/__test__/reset');

    expect(respuesta.status).toBe(204);
    const pedidos = await request(app).get('/pedidos');
    expect(pedidos.body).toEqual([]);
  });

  it('POST /__test__/seed deja solo el pedido de ejemplo: mesa 4, total 17220', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: MUFFIN, cantidad: 1 }] });

    const respuesta = await request(app).post('/__test__/seed');

    expect(respuesta.status).toBe(201);
    const pedidos = await request(app).get('/pedidos');
    expect(pedidos.body).toHaveLength(1);
    expect(pedidos.body[0]).toMatchObject({
      id: 1,
      mesaId: 4,
      estado: 'pendiente',
      total: 17220,
    });
  });
});