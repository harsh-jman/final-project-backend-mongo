const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.controller');
const { authenticate } = require('../middleware/authentication.middleware');
const { verifyAdminRole } = require('../middleware/authorization.middleware');

// GET request to fetch all data (requires valid JWT)
router.get('/fetch-all-data', authenticate, verifyAdminRole ,dataController.getAllData);
router.use('/user-data', authenticate , dataController.getUserData);

module.exports = router;


