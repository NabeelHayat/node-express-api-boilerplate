import mongoose from "mongoose";
import Promise from "bluebird";

import config from "../config";
import { logInfo, logError } from "./logger";
import { MONGOOSE_CALLBACK_TYPE } from "../helpers/enums";

mongoose.Promise = Promise;

export default (callback) => {
  mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then((x) => {
        logInfo(`Database URI: ${config.mongoose.url}`);
        logInfo(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        callback(MONGOOSE_CALLBACK_TYPE.CONNECT, null, x);
    })
    .catch((err) => {
        logError("Error connecting to mongo", err);

        callback(MONGOOSE_CALLBACK_TYPE.CONNECT_ERROR, err, null);
    });

    mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_OPEN, () => {
        logInfo("Database connected");
        callback(MONGOOSE_CALLBACK_TYPE.ON_OPEN, null, null);
    });

    mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_CLOSE, () => {
        logInfo("Database disconnected");
        callback(MONGOOSE_CALLBACK_TYPE.ON_CLOSE, null, null);
    });

    mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_ERROR, () => {
        const error = new Error(
        `unable to connect to database: ${config.mongoose.url}`
        );
        callback(MONGOOSE_CALLBACK_TYPE.ON_ERROR, error, null);
    });

    // print mongoose logs in dev env
    if (config.mongoose.debug) {
        mongoose.set("debug", (collectionName, method, query, doc) => {
            logInfo(`${collectionName}.${method}, ${query} ${doc}`);
        });
    }
};
