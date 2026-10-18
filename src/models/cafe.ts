import { Producto } from './producto';
import { Variedad } from './variedad';
import { Tamanio, Maquina } from './tamanio';

export abstract class Cafe extends Producto {
  protected abstract readonly maquina: Maquina;

  constructor(
    id: number,
    nombre: string,
    precioBase: number,
    public readonly variedad: Variedad,
    public readonly tamanio: Tamanio,
  ) {
    super(id, nombre, precioBase);
  }

  calcularPrecio(): number {
    const gramos = this.tamanio.gramosPara(this.maquina);
    return this.precioBase + gramos * this.variedad.precioPorGramo;
  }
}