#!/usr/bin/env node

const http = require('http');
const mongoose = require('mongoose');

const config = require('config');

const app = require('../app');
const { MONGOOSE_CALLBACK_TYPE, PROCESS_ON } = require('../helpers/enums');
const { logError, logInfo } = require('../utils/logger');
const connectMongooseCallback = require('../utils/mongoose');

const port = config.app.port;

if (!process.env.PORT) process.env.PORT = port;

const server = http.createServer(app);

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logError(`Port ${port} requires elevated privileges`);
            // process.exit(1);
            break;
        case 'EADDRINUSE':
            logError(`Port ${port} is already in use`);
            // process.exit(1);
            break;
        default:
            throw error;
    }
});

module.exports.startBootstrap = (options = {}) => {
    const opts = {
        dbConnection: true
    };

    Object.assign(opts, options);

    // If the db connection value is true, than first connect to the Db. otherwise the http server will start.
    if (opts.dbConnection) {
        dbConnection();
    } else {
        startServer();
    }
};

/**
 * -------------- SERVER ----------------.
 */

const dbConnection = () => {
    // First, we would connect to MongoDB, then start HTTP server for listening APIs.
    connectMongooseCallback((type, dbError, db) => {
        if (dbError) {
            throw dbError;
        }

        switch (type) {
            case MONGOOSE_CALLBACK_TYPE.CONNECT:
                startServer();
                break;
            case MONGOOSE_CALLBACK_TYPE.CONNECT_ERROR:
                server.close();
                break;
            case MONGOOSE_CALLBACK_TYPE.ON_OPEN:
                // When mongoose connection opens, Do the configuration/settings that you want before starting the server.
                break;
            case MONGOOSE_CALLBACK_TYPE.ON_CLOSE:
                server.close();
                break;
            case MONGOOSE_CALLBACK_TYPE.ON_ERROR:
                server.close();
                break;

            default:
                break;
        }
    });
};

const closeMongooseConnection = () => {
    mongoose.connection.close(() => {
        logInfo('Database connection disconnected through app termination');
    });
};

const startServer = () => {
    server.listen(port, () => {
        logInfo(`Server listening on \x1b[32m${port}\x1b[0m`);
    });
};

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logInfo('Server closed');
            // process.exit(1);
        });
    } else {
        // process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logError(error.message);
    exitHandler();
};

const onSIGEvent = () => {
    // If the Node process ends, Close the Mongoose connection
    closeMongooseConnection();
    if (server) {
        server.close();
    }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logError('SIGTERM received');
    onSIGEvent();
});

process.on('SIGINT', () => {
    logError('SIGINT received');
    onSIGEvent();
});
