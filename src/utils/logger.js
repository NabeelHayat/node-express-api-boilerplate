import winston from "winston";

import config from '../config';

const env = config.env;

// define the custom settings for each transport (file, console)
const options = {
    file: {
        level: "info",
        filename: `logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    errorFile: {
        level: "error",
        filename: `logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: "info",
        handleExceptions: true,
        json: false,
        colorize: true,
        prettyPrint: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.createLogger({
    transports: [
        
        new winston.transports.File(options.file),
        new winston.transports.File(options.errorFile),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (env !== "production") {
    logger.add(new winston.transports.Console(options.console));
}

// create a stream object with a 'write' function that will be used by `morgan`
export const logStream = {
    // eslint-disable-next-line no-unused-vars
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};


const Colors = {
    info: "\x1b[36m",
    error: "\x1b[31m",
    warn: "\x1b[33m",
    verbose: "\x1b[43m",
};

const processMessage = (message, colorCode) => {
    return env !== 'production' ? `${colorCode}${message}\x1b[0m` : message;
}

const logInfo = (message) => {
    logger.info(processMessage(message, Colors.info));
}

const logError = (message) => {
    logger.error(processMessage(message, Colors.error));
}

const logDebug =  (message) => {
    logger.debug(processMessage(message, Colors.debug));
}

const logWarn = (message) => {
    logger.warn(processMessage(message, Colors.warn));
}

const logVerbose = (message) => {
    logger.verbose(processMessage(message, Colors.verbose));
}

const logSilly = (message) => {
    logger.silly(processMessage(message, Colors.silly));
}

export {
    logInfo,
    logError,
    logDebug,
    logWarn,
    logVerbose,
    logSilly
};
