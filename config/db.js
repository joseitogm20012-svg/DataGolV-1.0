const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/futbol_predicciones';
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Conectado exitosamente: ${conn.connection.host} / BD: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        console.log('💡 TIP: Asegúrate de tener tu cadena de conexión correcta en el archivo .env (ej. de MongoDB Atlas)');
    }
};

module.exports = connectDB;
