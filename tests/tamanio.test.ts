import { describe, it, expect } from 'vitest';
import { Tamanio } from '../src/models/tamanio';

describe('Tamanio', () => {
  it.each([
    { nombre: 'Pocillo', maquina: 'Expreso', gramos: 18 },
    { nombre: 'Mediano', maquina: 'Expreso', gramos: 27 },
    { nombre: 'Taza grande', maquina: 'Expreso', gramos: 36 },
    { nombre: 'Pocillo', maquina: 'Filtrado', gramos: 6 },
    { nombre: 'Mediano', maquina: 'Filtrado', gramos: 15 },
    { nombre: 'Taza grande', maquina: 'Filtrado', gramos: 25 },
  ] as const)('$nombre en $maquina usa $gramos g', ({ nombre, maquina, gramos }) => {
    expect(new Tamanio(nombre).gramosPara(maquina)).toBe(gramos);
  });

  it('lanza error con un tamaño inválido', () => {
    expect(() => new Tamanio('Balde')).toThrow('Tamaño inválido: Balde');
  });
});