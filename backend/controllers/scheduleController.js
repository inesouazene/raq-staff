// controllers/scheduleController.js

const scheduleModel = require('../models/schedule');

const scheduleController = {
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
  },
	getTasksByWeek: async (req, res) => {
    try {
      const { startOfWeek, endOfWeek } = req.query;
      const tasks = await scheduleModel.getTasksByWeek(startOfWeek, endOfWeek);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = scheduleController;
