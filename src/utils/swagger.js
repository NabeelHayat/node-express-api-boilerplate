import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
require('../config');
import nconf from 'nconf';
/**
 * Swagger definition.
 */
const swaggerDefinition = {
    info: {
        title: nconf.app.name,
        version: nconf.app.version,
        description: nconf.app.description
    },
    basePath: '/api'
};

/**
 * Options for the swagger docs.
 */
const swaggerOptions = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: [
        path.join(__dirname, '/../routes.js'),
        path.join(__dirname, '/../docs/*.js'),
        path.join(__dirname, '/../docs/*.yml'),
        path.join(__dirname, '/../docs/*.yaml')
    ]
};

/**
 * Initialize swagger-jsdoc.
 */
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
