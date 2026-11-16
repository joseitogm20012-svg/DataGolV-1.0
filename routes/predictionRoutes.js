const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Rutas de Vistas y CRUD
// Listar todos los registros (Read)
router.get('/', predictionController.getAllPredictions);

// Mostrar formulario para nuevo registro
router.get('/predictions/new', predictionController.renderCreateForm);

// Guardar nuevo registro (Create)
router.post('/predictions', predictionController.createPrediction);

// Endpoint API para simular en tiempo real desde el formulario
router.get('/api/simulate', predictionController.simulateMatchAPI);

// Ver detalle de un registro específico (Read one)
router.get('/predictions/:id', predictionController.getPredictionById);

// Mostrar formulario de edición
router.get('/predictions/:id/edit', predictionController.renderEditForm);

// Actualizar registro (Update)
router.put('/predictions/:id', predictionController.updatePrediction);

// Eliminar registro (Delete)
router.delete('/predictions/:id', predictionController.deletePrediction);

module.exports = router;
