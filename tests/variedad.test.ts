import { describe, it, expect } from 'vitest';
import { Variedad } from '../src/models/variedad';

describe('Variedad', () => {
  it.each([
    { nombre: 'Brasil', precioPorGramo: 140 },
    { nombre: 'Colombia', precioPorGramo: 180 },
    { nombre: 'Etiopía', precioPorGramo: 240 },
  ])('$nombre cuesta $precioPorGramo por gramo', ({ nombre, precioPorGramo }) => {
    expect(new Variedad(nombre).precioPorGramo).toBe(precioPorGramo);
  });

  it('lanza error con una variedad inválida', () => {
    expect(() => new Variedad('Kenia')).toThrow('Variedad inválida: Kenia');
  });
});