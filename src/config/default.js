module.exports = {
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
        url: 'mongodb+srv://admin:uIDFyzWVLk3X9BGC@cluster0.u714h.mongodb.net/dopel-appservices?retryWrites=true&w=majority',
        debug: false,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        }
    }
};
