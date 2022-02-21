// eslint-disable-next-line max-classes-per-file
const httpStatus = require('http-status');

/**
 * @augments Error
 */
class ExtendableError extends Error {
    constructor(message, status, isPublic, stackErrors) {
        super(message);
        const { stack, errors } = stackErrors;

        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        this.errors = errors;
        stack ? (this.stack = stack) : Error.captureStackTrace(this, this.constructor.name);
    }
}

/**
 * Class representing an API error.
 *
 * @augments ExtendableError
 */
class APIError extends ExtendableError {
    /**
     * Creates an API error.
     *
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     * @param {object} stackErrors - Error stack or errors list.
     */
    constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, stackErrors, isPublic = false) {
        super(message, status, isPublic, stackErrors);
    }
}

module.exports =  APIError;
