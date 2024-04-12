const express = require('express');
const router = express.Router();
const { logMessage,getLogs } = require('../controllers/logging.controler');


router.get('/getLog', getLogs);
router.post('/makeLog', logMessage);

module.exports = router;