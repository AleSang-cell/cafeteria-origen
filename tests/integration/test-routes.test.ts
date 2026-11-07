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
});