import httpStatus from "http-status";
import config from "../config";
import APIError from "../helpers/APIError";
import { failureReponse } from "./apiResponse";

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const errorHandler = (err, req, res, next) => {
	const message = err.message || httpStatus[err.status];

	const response = failureReponse(err.status, message, err.errors);

	const result = {
		...response,
		...(config.env !== 'production' && { stack: err.stack }),
	};

	res.status(err.status).json(result);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const errorConverter = (err, req, res, next) => {
	let error = err;

	if (err instanceof expressValidation.ValidationError) {
		error = new APIError('Validation Error', err.status, { stack: err.stack, errors: err.errors });
	} else if (!(error instanceof ApiError)) {
		const statusCode =
			error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new APIError(message, statusCode, { stack: err.stack });
	}
	
	return errorHandler(error, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req, res, next) => {

	const err = new APIError('not Found', httpStatus.NOT_FOUND, {});
	return errorHandler(err, req, res);
};