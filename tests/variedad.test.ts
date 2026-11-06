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

  it.each(['Brasil', 'Colombia', 'Etiopía'])(
    '%s tiene una descripción con acidez, cuerpo y notas',
    (nombre) => {
      const { descripcion } = new Variedad(nombre);

      expect(descripcion).toMatch(/acidez/i);
      expect(descripcion).toMatch(/cuerpo/i);
      expect(descripcion).toMatch(/notas/i);
    },
  );

  it('Colombia tiene la descripción del enunciado', () => {
    expect(new Variedad('Colombia').descripcion).toBe(
      'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    );
  });
});