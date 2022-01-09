import mongoose from 'mongoose';
import Promise from 'bluebird';
import config from '../config';
import { log } from './logger';
import { MONGOOSE_CALLBACK_TYPE } from './enums';


mongoose.Promise = Promise;

export default callback => {
	mongoose
		.connect(config.mongoose.url, config.mongoose.options)
		.then(x => {	
			log.info(`Database URI: ${config.mongoose.url}`);
            log.info(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
			callback(MONGOOSE_CALLBACK_TYPE.CONNECT, null, x);
		})
		.catch(err => {
			log.error('Error connecting to mongo', err);

			callback(MONGOOSE_CALLBACK_TYPE.CONNECT_ERROR, err, null);
		});

	mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_OPEN, () => {
        log.info('Database connected');
		callback(MONGOOSE_CALLBACK_TYPE.ON_OPEN, null, null);
	});

	mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_CLOSE, () => {
        log.info('Database disconnected');
		callback(MONGOOSE_CALLBACK_TYPE.ON_CLOSE, null, null);
	});

	mongoose.connection.on(MONGOOSE_CALLBACK_TYPE.ON_ERROR, () => {
		const error = new Error(`unable to connect to database: ${config.mongoose.url}`)
		callback(MONGOOSE_CALLBACK_TYPE.ON_ERROR, error, null);
	});

	// print mongoose logs in dev env
	if (config.mongoose.debug) {
		mongoose.set('debug', (collectionName, method, query, doc) => {
            log.info(`${collectionName}.${method}, ${query} ${doc}`);
		});
	}
};
