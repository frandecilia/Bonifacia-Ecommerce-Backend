const express = require('express'); // Framework para crear el servidor
const mongoose = require('mongoose'); // ORM para interactuar con la base de datos
const cors = require('cors'); // Middleware para permitir peticiones desde otros dominios
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const app = express(); // Crear una instancia de la aplicación Express

//middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Habilitar el parseo de JSON en las peticiones


//conexion a la base de datos
mongoose.connect(process.env.MONGODB_URI) // Conectar a la base de datos
    .then(() => console.log('Conectado a MongoDB Atlas')) // Mensaje de éxito en la conexión
    .catch((error) => console.error('Error al conectar a MongoDB Atlas:', error)); // Mensaje de error en la conexión

//ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido a mi API');
});

//rutas
app.use('/api', require('./routes/routes'));

//iniciar el servidor
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto local: http://localhost:${port}`));