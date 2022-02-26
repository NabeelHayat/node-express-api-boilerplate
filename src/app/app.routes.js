const { Router } = require('express');
const apiRoutes = require('../api/v1/routes');
const config = require('config');
const { authLimiter } = require('../middlewares/apiLimiter');
const swaggerSpec = require('../utils/swagger');

/**
 * Contains all API routes for the application.
 */
const router = Router();

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    router.use('/api/v1/auth', authLimiter);
}

// v1 routes
router.use('/api', apiRoutes);

/**
 * GET /api/swagger.json.
 */
router.get('/api/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});

/**
 * GET /.
 */
router.get('/', (req, res) => {
    res.json({
        app: req.app.locals.title,
        apiVersion: req.app.locals.version
    });
});

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.json('OK'));

module.exports =  router;
