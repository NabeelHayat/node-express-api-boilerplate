require('./config/config');
const { startBootstrap } = require('./bin/www.js');

startBootstrap({
    dbConnection: false
});
