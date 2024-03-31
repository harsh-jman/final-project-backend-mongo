const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/authentication.middleware');
const { verifyAdminRole } = require('../middleware/authorization.middleware');

// Login route
router.post('/login', userController.login);

// Register a new user
router.post('/register', authenticate,verifyAdminRole, userController.register);

router.put('/update', authenticate,verifyAdminRole, userController.updateUser);

router.delete('/delete', authenticate,verifyAdminRole, userController.deleteUser);


module.exports = router;


