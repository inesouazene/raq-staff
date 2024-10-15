// routes/scheduleRoutes.js

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Récupérer tous les salariés
router.get('/employees', scheduleController.getAllEmployees);

// Récupérer les tâches d'une semaine spécifique
router.get('/tasks/week', scheduleController.getTasksByWeek);

module.exports = router;
