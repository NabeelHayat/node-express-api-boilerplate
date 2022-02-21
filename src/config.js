require('dotenv').config();
import path from 'path';



let dir = `${process.cwd()}/compiled/config/`; // ideally this should be first line before any other module acceess config
console.log("dir", dir);
process.env.NODE_CONFIG_DIR = dir;


import config from 'config';
import Joi from 'joi';


console.log(config);

const loadConfig = () => {
    const envVarsSchema = Joi.object()
        .keys({
            env: Joi.string().valid('production', 'development', 'test').required(),
            app: {
                version: Joi.string().required().default('1.0.0')
            },
            mongoose: {
                url: Joi.string().required().description('Mongo DB url')
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
