import { Router } from 'express';

import config from '../config';
import { authLimiter } from '../middlewares/apiLimiter';	
import swaggerSpec from '../utils/swagger';

/**
 * Contains all API routes for the application.
 */
const router = Router();

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	router.use('/api/v1/auth', authLimiter);
}

// v1 routes
// router.use('/api/v1', v1Routes);

/**
 * GET /api/swagger.json
 */
router.get('/swagger.json', (req, res) => {
	res.json(swaggerSpec);
});

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.json({
		app: req.app.locals.title,
		apiVersion: req.app.locals.version
	});
});

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.json('OK'));

export default router;