import { Cafe } from './cafe';
import { Variedad } from './variedad';
import { Tamanio } from './tamanio';

export class Filtrado extends Cafe {
  static readonly PRECIO_BASE = 3200;
  protected readonly maquina = 'Filtrado';

  constructor(id: number, variedad: Variedad, tamanio: Tamanio) {
    super(id, 'Filtrado', Filtrado.PRECIO_BASE, variedad, tamanio);
  }
}