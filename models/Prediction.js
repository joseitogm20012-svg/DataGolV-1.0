const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
    {
        equipoLocal: {
            type: String,
            required: [true, 'El equipo local es obligatorio.'],
            trim: true,
            minlength: [2, 'El nombre del equipo local debe tener al menos 2 caracteres.']
        },
        equipoVisitante: {
            type: String,
            required: [true, 'El equipo visitante es obligatorio.'],
            trim: true,
            minlength: [2, 'El nombre del equipo visitante debe tener al menos 2 caracteres.']
        },
        liga: {
            type: String,
            required: [true, 'La liga o competición es obligatoria.'],
            trim: true,
            default: 'UEFA Champions League'
        },
        fechaPartido: {
            type: Date,
            required: [true, 'La fecha del partido es obligatoria.'],
            default: Date.now
        },
        // Resultados predichos por el motor estadístico
        golesLocalPredicho: {
            type: Number,
            required: [true, 'Los goles estimados del local son obligatorios.'],
            min: [0, 'Los goles no pueden ser negativos.']
        },
        golesVisitantePredicho: {
            type: Number,
            required: [true, 'Los goles estimados del visitante son obligatorios.'],
            min: [0, 'Los goles no pueden ser negativos.']
        },
        probabilidadLocal: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        probabilidadEmpate: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        probabilidadVisitante: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        pronosticoRecomendado: {
            type: String,
            required: true,
            enum: ['Gana Local', 'Empate', 'Gana Visitante']
        },
        factorClave: {
            type: String,
            trim: true,
            default: 'Ventaja de local y rendimiento ofensivo promedio.'
        },
        analisis: {
            type: String,
            trim: true
        },
        // Estado del partido y validación de acierto
        estado: {
            type: String,
            enum: ['Pendiente', 'Acertada', 'Fallada'],
            default: 'Pendiente'
        },
        // Resultado final real (opcional, para cuando se juegue el partido)
        golesLocalReal: {
            type: Number,
            default: null,
            min: [0, 'Los goles reales no pueden ser negativos.']
        },
        golesVisitanteReal: {
            type: Number,
            default: null,
            min: [0, 'Los goles reales no pueden ser negativos.']
        }
    },
    {
        timestamps: true
    }
);

// Validación personalizada: el equipo local no puede ser igual al visitante
predictionSchema.pre('validate', function () {
    if (this.equipoLocal && this.equipoVisitante) {
        if (this.equipoLocal.trim().toLowerCase() === this.equipoVisitante.trim().toLowerCase()) {
            this.invalidate('equipoVisitante', 'El equipo local y el visitante no pueden ser el mismo.');
        }
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);
