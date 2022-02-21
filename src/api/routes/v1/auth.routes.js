import { Router } from 'express';

import validate from '../../../middlewares/validate';
import { register } from '../../v1_modules/validations/auth.validation';
import controller from '../../v1_modules/auth/auth.controller';

/**
 * Contains all Authentication routes for the application.
 */
const router = Router();

router
    .route('/register')
    /** GET /api/v1/auth/register - Register users */
    .get(validate(register), controller.register);

export default router;
