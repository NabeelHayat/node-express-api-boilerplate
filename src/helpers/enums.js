/**
 * Enum for mongoose callback.
 *
 * @readonly
 * @enum {string}
 */
module.exports.MONGOOSE_CALLBACK_TYPE = Object.freeze({
    CONNECT: 'connect',
    CONNECT_ERROR: 'connect_error',
    ON_OPEN: 'open',
    ON_CLOSE: 'close',
    ON_ERROR: 'error'
});

/**
 * Enum for node process events.
 *
 * @readonly
 * @enum {string}
 */
module.exports.PROCESS_ON = Object.freeze({
    SIGINT: 'SIGINT',
    SIGTERM: 'SIGTERM',
    UNCAUGHTEXCEPTION: 'uncaughtException',
    UNHANDLEDREJECTION: 'unhandledRejection'
});
