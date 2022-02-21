const { Router } = require('express');
const v1Router = require('./v1');

const router = Router();

// ---------------------------------------------------------
// V1 routes
// ---------------------------------------------------------
router.use('/v1', v1Router);

/**
 * GET v1/status.
 */
router.get('/status', (req, res) => res.send('OK'));

module.exports =  router;
