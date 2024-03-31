const express = require('express');
const router = express.Router();
const usersRouter = require('./user.routes');
const passwordRouter = require('./Password.routes'); 
const dataRouter = require('./data.routes')
const skillsRouter = require('./skills.routes')

router.use('/users', usersRouter);
router.use('/password', passwordRouter);
router.use('/data', dataRouter);
router.use('/skills', skillsRouter);


module.exports = router;
