const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const connectDB = require('./config/db');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Conexión a la Base de Datos NoSQL (MongoDB)
connectDB();

// 2. Configuración del Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. Middlewares
// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Parseo de formularios URL-encoded y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Soporte para métodos PUT y DELETE desde formularios HTML
app.use(methodOverride('_method'));

// 4. Enrutamiento (Routes)
app.use('/', predictionRoutes);

// 5. Manejo de Rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página No Encontrada (404)',
        mensaje: 'La ruta solicitada no existe en la aplicación.'
    });
});

// 6. Manejo global de errores (500)
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err.stack);
    res.status(500).render('error', {
        title: 'Error Interno del Servidor',
        mensaje: 'Ocurrió un error inesperado en el servidor.',
        error: process.env.NODE_ENV === 'development' ? err : null
    });
});

// 7. Inicio del Servidor HTTP
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📁 Arquitectura MVC activa | Motor de vistas: EJS`);
});
