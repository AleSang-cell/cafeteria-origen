import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

// supertest recibe la app de Express directamente: no hace falta levantar
// el servidor ni ocupar un puerto (por eso app.ts está separado de server.ts).

// Ids del catálogo usados en los tests (ver src/data/catalogo.ts):
// 9  = Expreso Mediano Colombia   -> 7360
// 10 = Filtrado Mediano Colombia  -> 5900
// 19 = Muffin de chocolate        -> 2500

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

  it('cada producto indica su tipo: expreso, filtrado o pasteleria', async () => {
    const res = await request(app).get('/productos');

    for (const producto of res.body) {
      expect(['expreso', 'filtrado', 'pasteleria']).toContain(producto.tipo);
    }
  });

  it('hay 9 expresos, 9 filtrados y 2 productos de pastelería', async () => {
    const res = await request(app).get('/productos');
    const contar = (tipo: string) =>
      res.body.filter((p: { tipo: string }) => p.tipo === tipo).length;

    expect(contar('expreso')).toBe(9);
    expect(contar('filtrado')).toBe(9);
    expect(contar('pasteleria')).toBe(2);
  });
});

describe('GET /productos/:id', () => {
  it('responde 200 con un expreso, su tamaño, su variedad con descripción y su precio', async () => {
    const res = await request(app).get('/productos/9');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 9,
      tipo: 'expreso',
      nombre: 'Expreso',
      tamanio: 'Mediano',
      variedad: {
        nombre: 'Colombia',
        descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
      },
      precio: 7360,
    });
  });

  it('distingue un filtrado por su tipo, sin leer el nombre', async () => {
    const res = await request(app).get('/productos/10');

    expect(res.status).toBe(200);
    expect(res.body.tipo).toBe('filtrado');
    expect(res.body.precio).toBe(5900);
  });

  it('responde 200 con un producto de pastelería y su tipo', async () => {
    const res = await request(app).get('/productos/19');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 19,
      tipo: 'pasteleria',
      nombre: 'Muffin de chocolate',
      precio: 2500,
    });
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