import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { pedidoService } from '../../src/services/pedidoService';

describe('API de reportes', () => {
  beforeEach(() => {
    pedidoService.reset();
  });

  it('GET /reportes/facturacion devuelve 0 si no hay pedidos', async () => {
    const respuesta = await request(app).get('/reportes/facturacion');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ facturacionTotal: 0 });
  });

  it('GET /reportes/facturacion suma los totales de varios pedidos', async () => {
    await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 1, cantidad: 2 }] });
    await request(app).post('/pedidos').send({
      items: [
        { productoId: 2, cantidad: 1 },
        { productoId: 19, cantidad: 3 },
      ],
    });

    const respuesta = await request(app).get('/reportes/facturacion');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ facturacionTotal: 21580 });
  });

  it('GET /reportes/mas-vendido devuelve null si no hay ventas', async () => {
    const respuesta = await request(app).get('/reportes/mas-vendido');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ masVendido: null });
  });

  it('GET /reportes/mas-vendido refleja los pedidos creados de punta a punta', async () => {
    await request(app).post('/pedidos').send({
      items: [
        { productoId: 1, cantidad: 4 },
        { productoId: 2, cantidad: 1 },
      ],
    });
    await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 3, cantidad: 2 }] });

    const respuesta = await request(app).get('/reportes/mas-vendido');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      masVendido: {
        productos: ['Expreso'],
        cantidad: 6,
      },
    });
  });

  it('GET /reportes/mas-vendido conserva todos los productos empatados', async () => {
    await request(app).post('/pedidos').send({
      items: [
        { productoId: 1, cantidad: 3 },
        { productoId: 2, cantidad: 3 },
        { productoId: 19, cantidad: 1 },
      ],
    });

    const respuesta = await request(app).get('/reportes/mas-vendido');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.masVendido).toEqual({
      productos: ['Expreso', 'Filtrado'],
      cantidad: 3,
    });
  });
});
