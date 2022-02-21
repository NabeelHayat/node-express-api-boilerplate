export default {
    env: 'NODE_ENV',
    app: {
        port: 'APP_PORT',
        host: 'APP_HOST',
        name: 'APP_NAME',
        version: 'APP_VERSION',
        description: 'APP_DESCRIPTION'
    },
    jwt: {
        secret: 'JWT_SECRET'
    },
    mongoose: {
        url: 'MONGODB_URL'
    }
};
