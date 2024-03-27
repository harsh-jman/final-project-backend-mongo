const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password.controller');

router.post('/reset', passwordController.resetPassword);

router.post('/forget', passwordController.forgotPassword);

module.exports = router;
