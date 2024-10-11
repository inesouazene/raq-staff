// controllers/scheduleController.js

const scheduleModel = require('../models/schedule');

const scheduleController = {
  getWeekSchedule: async (req, res) => {
    try {
      const { date } = req.params;
      const tasks = await scheduleModel.getWeekSchedule(date);
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        start: `${task.date}T${task.heure_debut}`,
        end: `${task.date}T${task.heure_fin}`,
        resourceId: task.id_salarie,
        title: task.description,
        bgColor: task.position_couleur,
        position: task.position_nom,
        employeeName: `${task.prenom} ${task.nom}`
      }));
      res.json(formattedTasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEmployeeWeekSchedule: async (req, res) => {
    try {
      const { employeeId, date } = req.params;
      const tasks = await scheduleModel.getEmployeeWeekSchedule(employeeId, date);
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        start: `${task.date}T${task.heure_debut}`,
        end: `${task.date}T${task.heure_fin}`,
        resourceId: task.id_salarie,
        title: task.description,
        bgColor: task.position_couleur,
        position: task.position_nom
      }));
      res.json(formattedTasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTask: async (req, res) => {
    try {
      const newTask = await scheduleModel.createTask(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const updatedTask = await scheduleModel.updateTask(taskId, req.body);
      if (updatedTask) {
        res.json(updatedTask);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const deletedTask = await scheduleModel.deleteTask(taskId);
      if (deletedTask) {
        res.json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllEmployees: async (req, res) => {
    try {
      const employees = await scheduleModel.getAllEmployees();
      const formattedEmployees = employees.map(employee => ({
        id: employee.id,
        name: `${employee.prenom} ${employee.nom}`
      }));
      res.json(formattedEmployees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = scheduleController;
