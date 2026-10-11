export type Maquina = 'Expreso' | 'Filtrado';

const GRAMOS = new Map<string, Record<Maquina, number>>([
  ['Pocillo', { Expreso: 18, Filtrado: 6 }],
  ['Mediano', { Expreso: 27, Filtrado: 15 }],
  ['Taza grande', { Expreso: 36, Filtrado: 25 }],
]);

export class Tamanio {
  private readonly gramosPorMaquina: Record<Maquina, number>;

  constructor(readonly nombre: string) {
    const gramos = GRAMOS.get(nombre);
    if (!gramos) {
      throw new Error(`Tamaño inválido: ${nombre}`);
    }
    this.gramosPorMaquina = gramos;
  }

  gramosPara(maquina: Maquina): number {
    return this.gramosPorMaquina[maquina];
  }
}