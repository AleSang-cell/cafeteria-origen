const PRECIOS_POR_GRAMO = new Map<string, number>([
  ['Brasil', 140],
  ['Colombia', 180],
  ['Etiopía', 240],
]);

export class Variedad {
  readonly precioPorGramo: number;

  constructor(readonly nombre: string) {
    const precio = PRECIOS_POR_GRAMO.get(nombre);
    if (precio === undefined) {
      throw new Error(`Variedad inválida: ${nombre}`);
    }
    this.precioPorGramo = precio;
  }
}