import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { pedidoService } from '../../src/services/pedidoService';

const pedidoValido = {
  items: [
    { productoId: 1, cantidad: 2 },
    { productoId: 19, cantidad: 3 },
  ],
};

describe('API de pedidos', () => {
  beforeEach(() => {
    pedidoService.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /pedidos crea un pedido, responde 201 y devuelve el total', async () => {
    const respuesta = await request(app).post('/pedidos').send(pedidoValido);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toEqual({
      id: 1,
      mesaId: null,
      estado: 'pendiente',
      items: pedidoValido.items,
      total: 17540,
    });
  });

  it.each([
    ['sin items', {}],
    ['con items que no son un arreglo', { items: 'invalido' }],
    ['sin ningún item', { items: [] }],
    ['con un producto inexistente', { items: [{ productoId: 999, cantidad: 1 }] }],
    ['con cantidad cero', { items: [{ productoId: 1, cantidad: 0 }] }],
    ['con una cantidad no entera', { items: [{ productoId: 1, cantidad: 1.5 }] }],
  ])('POST /pedidos responde 400 %s', async (_caso, body) => {
    const respuesta = await request(app).post('/pedidos').send(body);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty('error');
    expect(pedidoService.listar()).toHaveLength(0);
  });

  it('GET /pedidos lista los pedidos creados con sus totales', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 1 }] });
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 2 }] });

    const respuesta = await request(app).get('/pedidos');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([
      {
        id: 1,
        mesaId: null,
        estado: 'pendiente',
        items: [{ productoId: 1, cantidad: 1 }],
        total: 5020,
      },
      {
        id: 2,
        mesaId: null,
        estado: 'pendiente',
        items: [{ productoId: 19, cantidad: 2 }],
        total: 5000,
      },
    ]);
  });

  it('GET /pedidos/:id devuelve el pedido solicitado', async () => {
    await request(app).post('/pedidos').send(pedidoValido);

    const respuesta = await request(app).get('/pedidos/1');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.id).toBe(1);
    expect(respuesta.body.total).toBe(17540);
  });

  it('GET /pedidos/:id responde 404 si el pedido no existe', async () => {
    const respuesta = await request(app).get('/pedidos/999');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('reinicia el almacenamiento y los ids antes de cada test', async () => {
    const respuesta = await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 2, cantidad: 1 }] });

    expect(respuesta.body.id).toBe(1);
    expect(pedidoService.listar()).toHaveLength(1);
  });

  it('responde 500 sin exponer detalles ante un error inesperado', async () => {
    vi.spyOn(pedidoService, 'crearPedido').mockImplementationOnce(() => {
      throw new Error('detalle interno');
    });

    const respuesta = await request(app).post('/pedidos').send(pedidoValido);

    expect(respuesta.status).toBe(500);
    expect(respuesta.body).toEqual({ error: 'Error interno del servidor' });
  });

  it('responde 404 para una ruta inexistente', async () => {
    const respuesta = await request(app).get('/ruta-inexistente');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toHaveProperty('error');
  });

  describe('mesa del pedido', () => {
    // Ids del catálogo (ver src/data/catalogo.ts)
    const EXPRESO_MEDIANO_COLOMBIA = 9; // $7.360
    const MUFFIN = 19; // $2.500

    // El pedido de ejemplo del enunciado: mesa 4, total 17220
    const pedidoMesa4 = {
      mesaId: 4,
      items: [
        { productoId: EXPRESO_MEDIANO_COLOMBIA, cantidad: 2 },
        { productoId: MUFFIN, cantidad: 1 },
      ],
    };

    it('POST /pedidos con mesaId lo guarda y lo devuelve', async () => {
      const respuesta = await request(app).post('/pedidos').send(pedidoMesa4);

      expect(respuesta.status).toBe(201);
      expect(respuesta.body).toEqual({
        id: 1,
        mesaId: 4,
        estado: 'pendiente',
        items: pedidoMesa4.items,
        total: 17220,
      });
    });

    it('POST /pedidos sin mesaId queda para retirar en la barra (mesaId null)', async () => {
      const respuesta = await request(app).post('/pedidos').send({ items: pedidoMesa4.items });

      expect(respuesta.status).toBe(201);
      expect(respuesta.body.mesaId).toBeNull();
    });

    it('GET /pedidos/:id devuelve la mesa, el estado, los items y el total', async () => {
      await request(app).post('/pedidos').send(pedidoMesa4);

      const respuesta = await request(app).get('/pedidos/1');

      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toEqual({
        id: 1,
        mesaId: 4,
        estado: 'pendiente',
        items: pedidoMesa4.items,
        total: 17220,
      });
    });
  });
});
