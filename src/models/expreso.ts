import { Cafe } from './cafe';
import { Variedad } from './variedad';
import { Tamanio } from './tamanio';

export class Expreso extends Cafe {
  static readonly PRECIO_BASE = 2500;
  protected readonly maquina = 'Expreso';

  constructor(id: number, variedad: Variedad, tamanio: Tamanio) {
    super(id, 'Expreso', Expreso.PRECIO_BASE, variedad, tamanio);
  }
}