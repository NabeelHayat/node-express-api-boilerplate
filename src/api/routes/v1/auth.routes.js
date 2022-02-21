const { Router } = require('express');

const validate = require('../../../middlewares/validate');
const { register } = require('../../v1_modules/validations/auth.validation');
const controller = require('../../v1_modules/auth/auth.controller');

/**
 * Contains all Authentication routes for the application.
 */
const router = Router();

router
    .route('/register')
    /** GET /api/v1/auth/register - Register users */
    .get(validate(register), controller.register);

module.exports =  router;
