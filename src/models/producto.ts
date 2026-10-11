export abstract class Producto {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly precioBase: number,
  ) {
    if (new.target === Producto) {
      throw new Error('Producto es abstracta: usá una subclase');
    }
  }

  calcularPrecio(): number {
    throw new Error('calcularPrecio() debe implementarse en la subclase');
  }
}