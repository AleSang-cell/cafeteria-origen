interface DatosVariedad {
  precioPorGramo: number;
  descripcion: string;
}

// Un solo lugar con los datos de cada origen: precio y descripción
// no pueden quedar desfasados.
const DATOS_POR_VARIEDAD = new Map<string, DatosVariedad>([
  ['Brasil', {
    precioPorGramo: 140,
    descripcion: 'Acidez baja, cuerpo intenso y notas de chocolate y frutos secos',
  }],
  ['Colombia', {
    precioPorGramo: 180,
    descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  }],
  ['Etiopía', {
    precioPorGramo: 240,
    descripcion: 'Acidez alta, cuerpo ligero y notas frutales y de jazmín',
  }],
]);

export class Variedad {
  readonly precioPorGramo: number;
  readonly descripcion: string;

  constructor(readonly nombre: string) {
    const datos = DATOS_POR_VARIEDAD.get(nombre);
    if (!datos) {
      throw new Error(`Variedad inválida: ${nombre}`);
    }
    this.precioPorGramo = datos.precioPorGramo;
    this.descripcion = datos.descripcion;
  }
}