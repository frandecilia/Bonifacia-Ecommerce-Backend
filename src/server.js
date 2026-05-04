const express = require('express'); // Framework para crear el servidor
const cors = require('cors'); // Middleware para permitir peticiones desde otros dominios
require('./db/config.db'); // Conexión a la base de datos

const app = express(); // Crear una instancia de la aplicación Express

//middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Habilitar el parseo de JSON en las peticiones

//ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido a mi API');
});

//rutas
app.use('/api', require('./routes/index.routes'));

//iniciar el servidor
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto local: http://localhost:${port}`));