import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

// supertest recibe la app de Express directamente: no hace falta levantar
// el servidor ni ocupar un puerto (por eso app.ts está separado de server.ts).

describe('GET /productos', () => {
  it('responde 200 con los 20 productos del catálogo', async () => {
    const res = await request(app).get('/productos');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
  });

  it('cada producto incluye id, nombre y precio final', async () => {
    const res = await request(app).get('/productos');

    for (const producto of res.body) {
      expect(producto).toHaveProperty('id');
      expect(producto).toHaveProperty('nombre');
      expect(producto).toHaveProperty('precio');
    }
  });
});

describe('GET /productos/:id', () => {
  it('responde 200 con un café, su variedad, su tamaño y su precio', async () => {
    const res = await request(app).get('/productos/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      nombre: 'Expreso',
      precio: 5020,
      variedad: 'Brasil',
      tamanio: 'Pocillo',
    });
  });

  it('responde 200 con un producto de pastelería', async () => {
    const res = await request(app).get('/productos/19');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 19, nombre: 'Muffin de chocolate', precio: 2500 });
  });

  it('responde 404 si el producto no existe', async () => {
    const res = await request(app).get('/productos/999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('responde 404 si el id no es un número', async () => {
    const res = await request(app).get('/productos/abc');

    expect(res.status).toBe(404);
  });
});