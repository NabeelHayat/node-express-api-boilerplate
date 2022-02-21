const mongoose = require('mongoose');
const Promise = require('bluebird');

const config = require('config');
const { logInfo, logError } = require('./logger');
const { MONGOOSE_CALLBACK_TYPE } = require('../helpers/enums');

const { url, options, debug } = config.mongoose;

mongoose.Promise = Promise;

module.exports = (callback) => {
    mongoose
        .connect(url, options)
        .then((x) => {
            logInfo(`Database URI: ${url}`);
            logInfo(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
            callback(MONGOOSE_CALLBACK_TYPE.CONNECT, null, x);
        })
        .catch((err) => {
            logError('Error connecting to mongo', err);

            callback(MONGOOSE_CALLBACK_TYPE.CONNECT_ERROR, err, null);
        });

    mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_OPEN, () => {
        logInfo('Database connected');
        callback(MONGOOSE_CALLBACK_TYPE.ON_OPEN, null, null);
    });

    mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_CLOSE, () => {
        logInfo('Database disconnected');
        callback(MONGOOSE_CALLBACK_TYPE.ON_CLOSE, null, null);
    });

    mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_ERROR, () => {
        const error = new Error(`unable to connect to database: ${url}`);

        callback(MONGOOSE_CALLBACK_TYPE.ON_ERROR, error, null);
    });

    // print mongoose logs in dev env
    if (debug) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            logInfo(`${collectionName}.${method}, ${query} ${doc}`);
        });
    }
};
