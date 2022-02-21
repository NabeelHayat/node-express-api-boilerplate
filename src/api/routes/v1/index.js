const { Router } = require('express');
const authRouter = require('./auth.routes');

const router = Router();

// ---------------------------------------------------------
// Auth routes
// ---------------------------------------------------------
router.use('/auth', authRouter);

module.exports =  router;
