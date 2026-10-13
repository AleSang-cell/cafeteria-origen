import { Producto } from '../models/producto';
import { Expreso } from '../models/expreso';
import { Filtrado } from '../models/filtrado';
import { Pasteleria } from '../models/pasteleria';
import { Variedad } from '../models/variedad';
import { Tamanio } from '../models/tamanio';

class Catalogo {
  constructor(private readonly productos: Producto[]) {}

  listar(): Producto[] {
    return [...this.productos];
  }

  buscarPorId(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }
}

const TAMANIOS = ['Pocillo', 'Mediano', 'Taza grande'];
const VARIEDADES = ['Brasil', 'Colombia', 'Etiopía'];

const productos: Producto[] = [];
let id = 1;

for (const tamanio of TAMANIOS) {
  for (const variedad of VARIEDADES) {
    productos.push(new Expreso(id++, new Variedad(variedad), new Tamanio(tamanio)));
    productos.push(new Filtrado(id++, new Variedad(variedad), new Tamanio(tamanio)));
  }
}

productos.push(new Pasteleria(id++, 'Muffin de chocolate', 2500));
productos.push(new Pasteleria(id++, 'Torta selva negra', 4200));

export const catalogo = new Catalogo(productos);
