// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Base de datos
const db = require('./models/db');

// Conexión prueba
db.query('SELECT NOW()')
  .then(result => console.log('✅ Conexión exitosa a PostgreSQL:', result.rows[0]))
  .catch(error => console.error('❌ Error de conexión a PostgreSQL:', error));

// Rutas
const vendedorRoutes = require('./routes/vendedorRoutes');
app.use('/api/vendedores', vendedorRoutes);

// Ruta de prueba
app.get('/', (req, res) => res.send('API Turismo Comuna 13 funcionando'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});



