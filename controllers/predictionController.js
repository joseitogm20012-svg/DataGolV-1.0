const Prediction = require('../models/Prediction');
const { predictMatch, TEAM_RATINGS } = require('../utils/predictionEngine');

// 1. LISTAR TODAS LAS PREDICCIONES (READ)
const getAllPredictions = async (req, res) => {
    try {
        const { liga, estado } = req.query;
        const filter = {};

        if (liga && liga !== 'todas') {
            filter.liga = liga;
        }
        if (estado && estado !== 'todos') {
            filter.estado = estado;
        }

        const predictions = await Prediction.find(filter).sort({ fechaPartido: -1 });

        // Estadísticas para el Dashboard
        const total = await Prediction.countDocuments();
        const acertadas = await Prediction.countDocuments({ estado: 'Acertada' });
        const falladas = await Prediction.countDocuments({ estado: 'Fallada' });
        const pendientes = await Prediction.countDocuments({ estado: 'Pendiente' });
        const efectividad = (acertadas + falladas) > 0 
            ? Math.round((acertadas / (acertadas + falladas)) * 100) 
            : 0;

        // Lista de ligas únicas para el filtro
        const ligasDisponibles = await Prediction.distinct('liga');

        res.render('index', {
            title: 'Panel de Pronósticos de Fútbol',
            predictions,
            stats: { total, acertadas, falladas, pendientes, efectividad },
            filtros: { liga: liga || 'todas', estado: estado || 'todos' },
            ligasDisponibles,
            mensaje: req.query.mensaje || null,
            tipoMensaje: req.query.tipoMensaje || 'success'
        });
    } catch (error) {
        console.error('Error al obtener predicciones:', error);
        res.render('error', {
            title: 'Error del Servidor',
            mensaje: 'No se pudieron cargar los pronósticos.',
            error
        });
    }
};

// 2. FORMULARIO PARA CREAR PREDICCIÓN
const renderCreateForm = (req, res) => {
    res.render('create', {
        title: 'Nuevo Pronóstico Inteligente',
        equiposPopulares: Object.keys(TEAM_RATINGS),
        formData: {},
        errores: null
    });
};

// 3. GUARDAR NUEVA PREDICCIÓN (CREATE)
const createPrediction = async (req, res) => {
    try {
        const {
            equipoLocal,
            equipoVisitante,
            liga,
            fechaPartido,
            usarAlgoritmo,
            golesLocalPredicho,
            golesVisitantePredicho,
            factorClave
        } = req.body;

        let predictionData = {
            equipoLocal,
            equipoVisitante,
            liga,
            fechaPartido: fechaPartido || Date.now()
        };

        // Si se activa el cálculo automático o no se ingresaron goles manualmente
        if (usarAlgoritmo === 'on' || golesLocalPredicho === '' || golesLocalPredicho === undefined) {
            const calculo = predictMatch(equipoLocal, equipoVisitante, liga);
            predictionData = {
                ...predictionData,
                ...calculo
            };
        } else {
            // Si el usuario especificó manualmente sus propios números
            const gLocal = parseInt(golesLocalPredicho, 10);
            const gVisitante = parseInt(golesVisitantePredicho, 10);
            
            let pronostico = 'Empate';
            if (gLocal > gVisitante) pronostico = 'Gana Local';
            else if (gVisitante > gLocal) pronostico = 'Gana Visitante';

            const calculo = predictMatch(equipoLocal, equipoVisitante, liga);

            predictionData = {
                ...predictionData,
                golesLocalPredicho: gLocal,
                golesVisitantePredicho: gVisitante,
                probabilidadLocal: calculo.probabilidadLocal,
                probabilidadEmpate: calculo.probabilidadEmpate,
                probabilidadVisitante: calculo.probabilidadVisitante,
                pronosticoRecomendado: pronostico,
                factorClave: factorClave || calculo.factorClave,
                analisis: `Pronóstico personalizado: ${gLocal} - ${gVisitante}. Factores de probabilidad: ${calculo.probabilidadLocal}% Local, ${calculo.probabilidadEmpate}% Empate, ${calculo.probabilidadVisitante}% Visitante.`
            };
        }

        const nuevaPrediccion = new Prediction(predictionData);
        await nuevaPrediccion.save();

        res.redirect('/?mensaje=Pronóstico creado exitosamente&tipoMensaje=success');
    } catch (error) {
        console.error('Error al crear predicción:', error);
        res.status(400).render('create', {
            title: 'Nuevo Pronóstico Inteligente',
            equiposPopulares: Object.keys(TEAM_RATINGS),
            formData: req.body,
            errores: error.errors ? Object.values(error.errors).map(e => e.message) : [error.message]
        });
    }
};

// 4. DETALLE DE UNA PREDICCIÓN (READ ONE)
const getPredictionById = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).render('error', {
                title: 'No encontrado',
                mensaje: 'El pronóstico solicitado no existe.'
            });
        }

        res.render('details', {
            title: `Detalle: ${prediction.equipoLocal} vs ${prediction.equipoVisitante}`,
            prediction
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error del Servidor',
            mensaje: 'Error al buscar el pronóstico.',
            error
        });
    }
};

// 5. FORMULARIO PARA EDITAR (UPDATE FORM)
const renderEditForm = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).render('error', {
                title: 'No encontrado',
                mensaje: 'El pronóstico solicitado no existe.'
            });
        }

        res.render('edit', {
            title: `Editar Pronóstico: ${prediction.equipoLocal} vs ${prediction.equipoVisitante}`,
            prediction,
            errores: null
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error del Servidor',
            mensaje: 'Error al cargar el formulario de edición.',
            error
        });
    }
};

// 6. ACTUALIZAR PREDICCIÓN O REGISTRAR RESULTADO REAL (UPDATE)
const updatePrediction = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            equipoLocal,
            equipoVisitante,
            liga,
            fechaPartido,
            golesLocalPredicho,
            golesVisitantePredicho,
            pronosticoRecomendado,
            factorClave,
            analisis,
            estado,
            golesLocalReal,
            golesVisitanteReal
        } = req.body;

        const prediction = await Prediction.findById(id);
        if (!prediction) {
            return res.status(404).render('error', {
                title: 'No encontrado',
                mensaje: 'El pronóstico no existe para actualizar.'
            });
        }

        prediction.equipoLocal = equipoLocal;
        prediction.equipoVisitante = equipoVisitante;
        prediction.liga = liga;
        prediction.fechaPartido = fechaPartido;
        prediction.golesLocalPredicho = Number(golesLocalPredicho);
        prediction.golesVisitantePredicho = Number(golesVisitantePredicho);
        prediction.pronosticoRecomendado = pronosticoRecomendado;
        prediction.factorClave = factorClave;
        prediction.analisis = analisis;

        // Si se proporcionan los goles reales, evaluamos automáticamente el acierto
        if (golesLocalReal !== '' && golesLocalReal !== undefined && golesLocalReal !== null &&
            golesVisitanteReal !== '' && golesVisitanteReal !== undefined && golesVisitanteReal !== null) {
            
            const gLReal = Number(golesLocalReal);
            const gVReal = Number(golesVisitanteReal);
            prediction.golesLocalReal = gLReal;
            prediction.golesVisitanteReal = gVReal;

            // Determinar resultado real
            let signoReal = 'Empate';
            if (gLReal > gVReal) signoReal = 'Gana Local';
            else if (gVReal > gLReal) signoReal = 'Gana Visitante';

            // Evaluar acierto
            if (signoReal === prediction.pronosticoRecomendado) {
                prediction.estado = 'Acertada';
            } else {
                prediction.estado = 'Fallada';
            }
        } else {
            prediction.estado = estado || 'Pendiente';
            prediction.golesLocalReal = null;
            prediction.golesVisitanteReal = null;
        }

        await prediction.save();

        res.redirect(`/?mensaje=Pronóstico actualizado correctamente&tipoMensaje=success`);
    } catch (error) {
        console.error('Error al actualizar predicción:', error);
        res.status(400).render('edit', {
            title: 'Editar Pronóstico',
            prediction: { ...req.body, _id: req.params.id },
            errores: error.errors ? Object.values(error.errors).map(e => e.message) : [error.message]
        });
    }
};

// 7. ELIMINAR PREDICCIÓN (DELETE)
const deletePrediction = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Prediction.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).render('error', {
                title: 'No encontrado',
                mensaje: 'No se encontró el pronóstico a eliminar.'
            });
        }

        res.redirect('/?mensaje=Pronóstico eliminado con éxito&tipoMensaje=warning');
    } catch (error) {
        console.error('Error al eliminar predicción:', error);
        res.status(500).render('error', {
            title: 'Error del Servidor',
            mensaje: 'No se pudo eliminar el pronóstico.',
            error
        });
    }
};

// 8. ENDPOINT API PARA SIMULACIÓN EN VIVO DESDE EL FRONTEND
const simulateMatchAPI = (req, res) => {
    const { local, visitante, liga } = req.query;
    if (!local || !visitante) {
        return res.status(400).json({ error: 'Debes proporcionar equipo local y visitante' });
    }
    const result = predictMatch(local, visitante, liga);
    res.json(result);
};

module.exports = {
    getAllPredictions,
    renderCreateForm,
    createPrediction,
    getPredictionById,
    renderEditForm,
    updatePrediction,
    deletePrediction,
    simulateMatchAPI
};
