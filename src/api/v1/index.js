const { Router } = require('express');
const authRouter = require('./routes/auth.routes');

const router = Router();

// ---------------------------------------------------------
// Auth routes
// ---------------------------------------------------------
router.use('/auth', authRouter);

module.exports = router;

