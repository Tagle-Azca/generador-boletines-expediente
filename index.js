const express = require('express');
const { PORT } = require('./src/config');
const boletinesRouter = require('./src/routes/boletines');

const app = express();
app.use(express.json());

// Rutas
app.use('/boletines', boletinesRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Emisor de boletines corriendo en puerto ${PORT}`);
});
