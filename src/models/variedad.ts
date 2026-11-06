const PRECIOS_POR_GRAMO = new Map<string, number>([
  ['Brasil', 140],
  ['Colombia', 180],
  ['Etiopía', 240],
]);

const DESCRIPCIONES = new Map<string, string>([
  ['Brasil', 'Acidez baja, cuerpo intenso y notas de chocolate y frutos secos'],
  ['Colombia', 'Acidez media, cuerpo equilibrado y notas cítricas y florales'],
  ['Etiopía', 'Acidez alta, cuerpo ligero y notas frutales y de jazmín'],
]);

export class Variedad {
  readonly precioPorGramo: number;
  readonly descripcion: string;

  constructor(readonly nombre: string) {
    const precio = PRECIOS_POR_GRAMO.get(nombre);
    if (precio === undefined) {
      throw new Error(`Variedad inválida: ${nombre}`);
    }
    this.precioPorGramo = precio;
    this.descripcion = DESCRIPCIONES.get(nombre) ?? '';
  }
}