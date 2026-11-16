require('dotenv').config();
const mongoose = require('mongoose');
const Prediction = require('./models/Prediction');
const { predictMatch } = require('./utils/predictionEngine');

const seedMatches = [
    {
        equipoLocal: 'Real Madrid',
        equipoVisitante: 'FC Barcelona',
        liga: 'LaLiga EA Sports',
        fechaPartido: new Date(Date.now() + 86400000 * 3),
        estado: 'Pendiente'
    },
    {
        equipoLocal: 'Manchester City',
        equipoVisitante: 'Liverpool',
        liga: 'Premier League',
        fechaPartido: new Date(Date.now() + 86400000 * 5),
        estado: 'Pendiente'
    },
    {
        equipoLocal: 'Bayern Múnich',
        equipoVisitante: 'Bayer Leverkusen',
        liga: 'Bundesliga',
        fechaPartido: new Date(Date.now() - 86400000 * 2),
        estado: 'Acertada',
        golesLocalReal: 2,
        golesVisitanteReal: 1
    },
    {
        equipoLocal: 'River Plate',
        equipoVisitante: 'Boca Juniors',
        liga: 'Liga Argentina',
        fechaPartido: new Date(Date.now() + 86400000 * 7),
        estado: 'Pendiente'
    }
];

async function seedDB() {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/futbol_predicciones';
        await mongoose.connect(uri);
        console.log('🌱 Conectado a MongoDB para sembrar datos...');

        await Prediction.deleteMany({});
        console.log('🧹 Colección limpiada.');

        for (const item of seedMatches) {
            const calculo = predictMatch(item.equipoLocal, item.equipoVisitante, item.liga);
            await Prediction.create({
                ...item,
                ...calculo,
                // Mantener estado y goles reales definidos en el seed si los hay
                estado: item.estado,
                golesLocalReal: item.golesLocalReal ?? null,
                golesVisitanteReal: item.golesVisitanteReal ?? null
            });
        }

        console.log('✅ 4 Partidos de prueba insertados con éxito.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error al sembrar datos:', err);
        process.exit(1);
    }
}

seedDB();
