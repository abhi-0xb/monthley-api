import { Joi } from "celebrate";

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    APP_ENV: Joi.string()
      .valid('production', 'dev', 'local')
      .required(),
    PORT: Joi.number()
      .required(),
    JWT_SECRET: Joi.string().required(),
    DB_HOST: Joi.string().hostname().required(),
    DB_PORT: Joi.number().port().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
}).unknown().required();
// ^ unknown() to allow unknown keys. Lot of envs get added by default by OS.

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const config = {
    nodeEnv: envVars.NODE_ENV,
    env: envVars.APP_ENV,
    port: envVars.PORT,
    jwt: {
        secret: "*****",
    },
    db: {
        host: envVars.DB_HOST,
        port: envVars.DB_PORT,
        database: envVars.DB_NAME,
        user: envVars.DB_USER,
        password: "*****",
    }
}
console.log(config);

config.jwt.secret = envVars.JWT_SECRET;
config.db.password = envVars.DB_PASSWORD;

export default config;
