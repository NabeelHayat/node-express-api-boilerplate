require('./config/loadConfig');
const { startBootstrap } = require('./bin/www.js');

startBootstrap({
    dbConnection: false
});
