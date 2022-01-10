import config from "../config";
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
		convertedError = new APIError({
			message: 'Validation Error',
			errors: err.errors,
			status: err.status,
			stack: err.stack,
		});
	} else if (!(error instanceof ApiError)) {
		const statusCode =
			error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new ApiError(statusCode, message, false, err.stack);
	}
	
	return errorHandler(error, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req, res, next) => {
	const err = new APIError({
		message: 'Not found',
		status: httpStatus.NOT_FOUND,
	});
	return errorHandler(err, req, res);
};