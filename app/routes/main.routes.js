const express = require('express');
const router = express.Router();
const usersRouter = require('./user.routes');
const passwordRouter = require('./Password.routes'); 

router.use('/users', usersRouter);
router.use('/password', passwordRouter);


module.exports = router;
