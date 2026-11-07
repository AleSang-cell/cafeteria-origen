# Cafetería Origen

API REST desarrollada con TypeScript y Express para administrar el catálogo, los pedidos y los reportes de una cafetería. El proyecto usa Vitest y Supertest para las pruebas unitarias y de integración.

## Requisitos

- Node.js 22.12 o superior.
- npm.

## Instalación y ejecución

```bash
npm ci
npm test
npm run typecheck
npm start
```

El servidor queda disponible en `http://localhost:3000`. Se puede cambiar el puerto con la variable de entorno `PORT`.

## Endpoints

### Productos

- `GET /productos`: lista los 20 productos del catálogo.
- `GET /productos/:id`: devuelve un producto o responde `404`.

Los productos usan ids numéricos del 1 al 20.

### Pedidos

- `POST /pedidos`: crea un pedido y responde `201`.
- `GET /pedidos`: lista todos los pedidos.
- `GET /pedidos/:id`: devuelve un pedido o responde `404`.

Ejemplo de creación:

```json
{
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 19, "cantidad": 3 }
  ]
}
```

Cada pedido se devuelve con su `id`, `estado`, `items` y `total` calculado. Los items deben tener un `productoId` existente y una `cantidad` entera positiva; de lo contrario la API responde `400`.

### Reportes

- `GET /reportes/facturacion`: devuelve `{ "facturacionTotal": número }`.
- `GET /reportes/mas-vendido`: devuelve el producto más vendido, todos los empatados o `null` si todavía no hay ventas.

El conteo de ventas se agrupa por el nombre del producto. Los cafés se agrupan por máquina (`Expreso` o `Filtrado`) y los productos de pastelería por su nombre individual.

## Manejo de errores

Los errores se procesan en un middleware centralizado:

- `400`: datos de entrada o JSON inválidos.
- `404`: recurso o ruta inexistente.
- `500`: error inesperado, sin exponer detalles internos.

## Pruebas y TDD

Los tests unitarios prueban los modelos y servicios de forma aislada. Los tests de integración usan Supertest sobre la aplicación de Express sin levantar un puerto.

`pedidoService.reset()` se ejecuta en cada `beforeEach` de las pruebas que almacenan pedidos para evitar contaminación entre casos y reiniciar los ids.

El historial conserva el ciclo TDD de esta etapa: primero el commit con los tests fallando y después el commit con el código mínimo que deja toda la suite en verde.

## Demo

El archivo `requests.http` contiene un recorrido completo: listar productos, crear pedidos, consultarlos y obtener ambos reportes. Se puede ejecutar con un cliente compatible con archivos HTTP mientras el servidor está iniciado con `npm start`.
