import { Router } from 'express';

import validate from '../../middlewares/validate';
import { register } from '../../validations/auth.validation';

/**
 * Contains all Authentication routes for the application.
 */
const router = Router();

router
	.route('/register')
	/** GET /api/v1/auth/register - Register users */
	.get(validate(register), PropertyController.fetchProperties);

export default router;