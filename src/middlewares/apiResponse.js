const generateResponse = function (statusCode, message, data, errorType) {
  const response = {
		statusCode: statusCode,
		message: message,
		error: errorType,
		data: data
	};

	return response;
}

const successReponse = (statusCode, message, data) => {
	return generateResponse(statusCode, message, data, null);
} 

const failureReponse = (statusCode, message, errors) => {
	return generateResponse(statusCode, message, null, errors);
}

export {
	successReponse,
	failureReponse
}