import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { pedidoService } from '../../src/services/pedidoService';

// Contrato de errores que usa el front: toda respuesta de error es
// { "error": "mensaje" }, y una mesa o un producto inexistente nunca da 500.

const formatoDeError = { error: expect.any(String) };
const MUFFIN = 19;

describe('formato de errores de la API', () => {
  beforeEach(() => {
    pedidoService.reset();
  });

  it('producto inexistente en el pedido responde 400 con { error }', async () => {
    const respuesta = await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 999, cantidad: 1 }] });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(formatoDeError);
  });

  it('mesa inexistente responde 400 con { error }', async () => {
    const respuesta = await request(app)
      .post('/pedidos')
      .send({ mesaId: 99, items: [{ productoId: MUFFIN, cantidad: 1 }] });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(formatoDeError);
  });

  it('producto inexistente en GET /productos/:id responde 404 con { error }', async () => {
    const respuesta = await request(app).get('/productos/999');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual(formatoDeError);
  });

  it('GET /pedidos/abc responde 404 con { error }', async () => {
    const respuesta = await request(app).get('/pedidos/abc');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual(formatoDeError);
  });

  it('JSON mal formado responde 400 con { error }', async () => {
    const respuesta = await request(app)
      .post('/pedidos')
      .set('Content-Type', 'application/json')
      .send('{ "items": [');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(formatoDeError);
  });

  it('ruta inexistente responde 404 con { error }', async () => {
    const respuesta = await request(app).get('/ruta-inexistente');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual(formatoDeError);
  });
});