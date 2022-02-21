require('dotenv').config();

let dir = `${process.cwd()}/src/config/`; // ideally this should be first line before any other module acceess config
process.env.NODE_CONFIG_DIR = dir;

const config = require('config');
const Joi = require('joi');

const loadConfig = () => {
    const envVarsSchema = Joi.object()
        .keys({
            env: Joi.string().valid('production', 'development', 'test').required(),
            app: {
                version: Joi.string().required(),
                port: Joi.number().required(),
                host: Joi.string(),
                name: Joi.string(),
                description: Joi.string()
            },
            mongoose: {
                url: Joi.string().required().description('Mongo DB url'),
                debug: Joi.boolean(),
                options: {
                    useNewUrlParser: Joi.boolean(),
                    useUnifiedTopology: Joi.boolean(),
                    autoIndex: Joi.boolean()
                }
            },
            jwt: {
                secret: Joi.string().required().default('---')
            }
        })
        .unknown();

    const { value: envVars, error } = envVarsSchema.validate(config);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }
};

loadConfig();
