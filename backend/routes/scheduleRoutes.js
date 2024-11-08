// routes/scheduleRoutes.js

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Récupérer tous les salariés
router.get('/employees', scheduleController.getAllEmployees);

// Récupérer les tâches d'une semaine spécifique
router.get('/tasks/week', scheduleController.getTasksByWeek);

// Route pour ajouter une nouvelle tâche
router.post('/tasks/add', scheduleController.addTask);

// Route pour récupérer une tâche par son id
router.get('/tasks/:id', scheduleController.getTaskById);

// Route pour supprimer une tâche
router.delete('/tasks/:id', scheduleController.deleteTask);

// Route pour modifier une tâche
router.put('/tasks/:id', scheduleController.updateTask);

// Route pour récupérer les types de tâches
router.get('/task-types', scheduleController.getTaskTypes);

// Route pour dupliquer les tâches d'une semaine vers une autre
router.post('/tasks/duplicate', scheduleController.duplicateTasks);

module.exports = router;
