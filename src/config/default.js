export default config = {
    env: 'development',
    app: {
        port: 8848,
        host: '127.0.0.1',
        name: 'Node Application',
        version: '1.0.0',
        description: '',
    },
    jwt: {
        secret: 'DopelSuperCoolAndAwosomeSecretForAuthorization'
    },
    mongoose: {
        url: '',
        debug: false,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        }
    }
};
