const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');
/**
 * Swagger definition.
 */
const swaggerDefinition = {
    info: {
        title: config.app.name,
        version: config.app.version,
        description: config.app.description
    },
    basePath: '/api'
};

/**
 * Options for the swagger docs.
 */
const swaggerOptions = {
    // const swaggerDefinitions
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

module.exports =  swaggerSpec;
