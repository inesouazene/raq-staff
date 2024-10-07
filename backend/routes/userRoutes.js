// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.patch('/reset_password', userController.resetPassword);
router.delete('/:id', userController.deleteUser);

module.exports = router;
