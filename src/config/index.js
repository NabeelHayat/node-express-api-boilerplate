import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
		APP_PORT: Joi.number().default(4000),
		APP_HOST: Joi.string().default('0.0.0.0'),
		APP_NAME: Joi.string().default('Node Application'),
		APP_DESCRIPTION: Joi.string().default(''),
		APP_VERSION: Joi.string().default('1.0.0'),
		MONGODB_URL: Joi.string().required().description('Mongo DB url'),
		JWT_SECRET: Joi.string().required().default('---'),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export default {
	env: envVars.NODE_ENV,
	port: envVars.APP_PORT,
	host: envVars.APP_HOST,
	appName: envVars.APP_NAME,
	appVersion: envVars.APP_VERSION,
	appDescription: envVars.APP_DESCRIPTION,
	jwtSecret: envVars.JWT_SECRET,
	mongoose: {
		url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'development' ? '' : ''),
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
		},
		debug: false,
	},
};