// routes/scheduleRoutes.js

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Récupérer le planning d'une semaine spécifique
router.get('/week/:date', scheduleController.getWeekSchedule);

// Récupérer les tâches d'un salarié pour une semaine spécifique
router.get('/employees/:employeeId/week/:date', scheduleController.getEmployeeWeekSchedule);

// Créer une nouvelle tâche
router.post('/task', scheduleController.createTask);

// Modifier une tâche existante
router.put('/task/:taskId', scheduleController.updateTask);

// Supprimer une tâche
router.delete('/task/:taskId', scheduleController.deleteTask);

// Récupérer tous les salariés (pour les ressources)
router.get('/employees', scheduleController.getAllEmployees);

module.exports = router;
