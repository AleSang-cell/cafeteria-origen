import express from 'express';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { pedidosRouter } from './routes/pedidos';
import { productosRouter } from './routes/productos';
import { reportesRouter } from './routes/reportes';

// app.ts solo arma la aplicación (middlewares y rutas) y la exporta.
// No llama a listen(): eso lo hace server.ts. Así los tests con supertest
// importan la app sin levantar el servidor ni ocupar un puerto.
export const app = express();

app.use(express.json());

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reportes', reportesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
