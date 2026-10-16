import { app } from './app';

// Único archivo que levanta el servidor. Se corre con `npm start`.
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Cafetería Origen escuchando en http://localhost:${PORT}`);
});