#!/usr/bin/env node 

import http from 'http';
import mongoose from 'mongoose';
import app from '../app';
import config from '../config';
import { MONGOOSE_CALLBACK_TYPE, PROCESS_ON } from '../utils/enums';
import { log } from '../utils/logger';
import connectMongooseCallback from '../utils/mongoose';

const port = config.port;

if (!process.env.PORT) process.env.PORT = port;

const server = http.createServer(app);

server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            log.error(`Port ${port} requires elevated privileges`);
            // process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(`Port ${port} is already in use`);
            // process.exit(1);
            break;
        default:
            throw error;
    }
});

server.listen(port, () => {
    log.info(`Server listening on \x1b[32m${port}\x1b[0m`);
});

// First, we would connect to MongoDB, then start HTTP server for listening APIs.
// connectMongooseCallback((type, dbError, db) => {
// 	if (dbError) {
// 		throw dbError;
// 	}

//     switch (type) {
//         case MONGOOSE_CALLBACK_TYPE.CONNECT:
//             server.listen(port, () => {
//                 log.info(`Server listening on \x1b[32m${port}\x1b[0m`);
//             });
//             break;
//         case MONGOOSE_CALLBACK_TYPE.CONNECT_ERROR:
//             server.close();
//             break;
//         case MONGOOSE_CALLBACK_TYPE.ON_OPEN:
//             // When mongoose connection opens, Do the configuration/settings that you want before starting the server.
//             break;
//         case MONGOOSE_CALLBACK_TYPE.ON_CLOSE:
//             server.close();
//             break
//         case MONGOOSE_CALLBACK_TYPE.ON_ERROR:
//             server.close();
//             break;

//         default:
//             break;
//     }
// });

/**
 * -------------- SERVER ----------------
 */

// const closeMongooseConnection = () => {
//     mongoose.connection.close(() => {
//         log.info('Database connection disconnected through app termination');
//     });
// }

const exitHandler = () => {
    if (server) {
        server.close(() => {
            log.info('Server closed');
            // process.exit(1);
        });
    } else {
        // process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    log.error(error);
    exitHandler();
};

const onSIGEvent = () => {
    // If the Node process ends, Close the Mongoose connection
    // closeMongooseConnection();
    if (server) {
        server.close();
    }
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    log.error('SIGTERM received');
    onSIGEvent();
});

process.on('SIGINT', () => {
    log.error('SIGINT received');
    onSIGEvent();
})
