const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const mongoose = require('mongoose');

const config = require('config');
const APIError = require('../helpers/APIError');
const { failureReponse } = require('./apiResponse');

/**
 * Error handler. Send stacktrace only during development.
 *
 * @public
 * @param {error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
module.exports.errorHandler = (err, req, res, next) => {
    const message = err.message || httpStatus[err.status];

    const response = failureReponse(err.status, message, err.errors);

    const result = {
        ...response,
        ...(config.env !== 'production' && { stack: err.stack })
    };

    res.status(err.status).json(result);
};

/**
 * If error is not an instanceOf APIError, convert it.
 *
 * @public
 * @param err
 * @param req
 * @param res
 * @param next
 */
module.exports.errorConverter = (err, req, res, next) => {
    let error = err;

    if (err instanceof expressValidation.ValidationError) {
        error = new APIError('Validation Error', err.status, { stack: err.stack, errors: err.errors });
    } else if (!(error instanceof APIError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];

        error = new APIError(message, statusCode, { stack: err.stack });
    }

    return errorHandler(error, req, res);
};

/**
 * Catch 404 and forward to error handler.
 *
 * @public
 * @param req
 * @param res
 * @param next
 */
module.exports.notFound = (req, res, next) => {
    const err = new APIError('not Found', httpStatus.NOT_FOUND, {});

    return errorHandler(err, req, res);
};
