// controllers/employeeController.js

const Employee = require('../models/employee');

// Fonction pour convertir une date au format JJ/MM/AAAA en AAAA-MM-JJ
const convertDateToISO = (dateFR) => {
  const [day, month, year] = dateFR.split('/');
  return `${year}-${month}-${day}`;
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.getById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Salarié non trouvé" });
    }
  } catch (error) {
    console.error('Error fetching employee', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { nom, prenom, date_naissance, telephone, email, heures_contrat, type_contrat } = req.body;

    // Validation basique
    if (!nom || !prenom || !date_naissance || !telephone || !email || !heures_contrat || !type_contrat) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérification que type_contrat est une valeur valide de l'enum
    const validContractTypes = ['CDI', 'CD2I', 'Service Civique', 'Alternance', 'Stage']; // Ajustez selon vos valeurs d'enum
    if (!validContractTypes.includes(type_contrat)) {
      return res.status(400).json({ error: 'Type de contrat invalide' });
    }

		// Conversion de la date de naissance au format ISO
		const formattedDateNaissance = convertDateToISO(date_naissance);


    const newEmployee = await Employee.create({
      nom,
      prenom,
      date_naissance: formattedDateNaissance,
			telephone,
      email,
      heures_contrat,
      type_contrat
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Erreur lors de la création du salarié', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, date_naissance, telephone, email, heures_contrat, type_contrat } = req.body;

    // Validation basique
    if (!nom || !prenom || !date_naissance || !telephone || !email || !heures_contrat || !type_contrat) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérification que type_contrat est une valeur valide de l'enum
    const validContractTypes = ['CDI', 'CD2I', 'Service Civique', 'Alternance', 'Stage'];
    if (!validContractTypes.includes(type_contrat)) {
      return res.status(400).json({ error: 'Type de contrat invalide' });
    }

    // Conversion de la date de naissance au format ISO
    const formattedDateNaissance = convertDateToISO(date_naissance);

    const updatedEmployee = await Employee.update(id, {
      nom,
      prenom,
      date_naissance: formattedDateNaissance,
      telephone,
      email,
      heures_contrat,
      type_contrat
    });

    if (updatedEmployee) {
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: "Salarié non trouvé" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du salarié', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.delete(id);

    if (deletedEmployee) {
			res.status(204).json({ message: 'Salarié supprimé avec succès' });
    } else {
      res.status(404).json({ message: "Salarié non trouvé" });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du salarié', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
