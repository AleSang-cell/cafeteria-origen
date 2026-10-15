import express from 'express';
import { productosRouter } from './routes/productos';

// app.ts solo arma la aplicación (middlewares y rutas) y la exporta.
// No llama a listen(): eso lo hace server.ts. Así los tests con supertest
// importan la app sin levantar el servidor ni ocupar un puerto.
export const app = express();

app.use(express.json());

app.use('/productos', productosRouter);