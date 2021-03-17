import * as Joi from '@hapi/joi';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import mysqlConfig from './mysql.config';
import mongoConfig from './mongo.config';
import fixtureConfig from './fixture.config';
import redisConfig from './redis.config';

const configuration = [mysqlConfig, mongoConfig, fixtureConfig, redisConfig];

const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string(),
  APP_ENV: Joi.string(),
  APP_PORT: Joi.number().integer(),
  MYSQL_HOST: Joi.string().hostname(),
  MYSQL_PORT: Joi.number().integer(),
  MYSQL_USERNAME: Joi.string(),
  MYSQL_PASSWORD: Joi.string().optional(),
  MYSQL_DBNAME: Joi.string(),
  REDIS_HOST: Joi.string().hostname(),
  REDIS_PORT: Joi.number().integer(),
});

const configValidationOptions = {
  allowUnknown: true,
  abortEarly: true,
};

const ConfigModule = NestConfigModule.forRoot({
  envFilePath: ['.env', '.env.development'], // the first one takes precedence.
  isGlobal: true,
  load: configuration,
  validationSchema: configValidationSchema,
  validationOptions: configValidationOptions,
});

export { ConfigModule };
