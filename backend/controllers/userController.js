// controllers/userController.js

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Employee = require('../models/employee');

exports.createUser = async (req, res) => {
  try {
    const { id_salarie, password, role } = req.body;

    // Vérifier si l'employé existe
    const employee = await Employee.getById(id_salarie);
    if (!employee) {
      return res.status(404).json({ error: 'Employé non trouvé' });
    }

    // Créer le nom d'utilisateur
    const username = `${employee.prenom}.${employee.nom}`
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^a-z0-9.]/g, ''); // Supprime les caractères spéciaux

    // Vérifier si le rôle est valide
    const validRoles = ['Manager', 'Utilisateur'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const newUser = await User.create({
      id_salarie,
      username,
      password_hash,
      role
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.resetPassword = async (req, res) => {
	try {
	  const { userId, newPassword } = req.body;

	  // Vérifier si l'utilisateur existe
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ error: 'Utilisateur non trouvé' });
	  }

	  // Hasher le nouveau mot de passe
	  const saltRounds = 10;
	  const password_hash = await bcrypt.hash(newPassword, saltRounds);

	  // Mettre à jour le mot de passe
	  const updatedUser = await User.updatePassword(userId, password_hash);

	  res.json({ message: 'Mot de passe mis à jour avec succès', userId: updatedUser.id });
	} catch (error) {
	  console.error('Erreur lors de la réinitialisation du mot de passe', error);
	  res.status(500).json({ error: 'Erreur interne du serveur' });
	}
  };

  exports.deleteUser = async (req, res) => {
	try {
	  const { id } = req.params;

	  // Vérifier si l'utilisateur existe
	  const user = await User.findById(id);
	  if (!user) {
		return res.status(404).json({ error: 'Utilisateur non trouvé' });
	  }

	  // Supprimer l'utilisateur
	  await User.delete(id);

	  res.json({ message: 'Utilisateur supprimé avec succès' });
	} catch (error) {
	  console.error('Erreur lors de la suppression de l\'utilisateur', error);
	  res.status(500).json({ error: 'Erreur interne du serveur' });
	}
  };
