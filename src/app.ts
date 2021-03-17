import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

const RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

const CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

/**
 * App
 * ```
 * const app = App.create()
 * app.start()
 * ```
 */
class App {
  private _instance: NestApplication;
  private _config: { [x: string]: any };

  public get instance() {
    return this._instance;
  }

  public get config() {
    return this._config;
  }

  public static async create(config: { [x: string]: any }) {
    const app = new App();
    app._config = config;
    app._instance = await NestFactory.create(AppModule);
    app._instance.use(helmet());
    app._instance.use(csurf());
    app._instance.use(rateLimit(RateLimitOptions));
    app._instance.enableCors(CorsOptions);
    return app;
  }

  public start() {
    this._instance.listen(this._config.port, () => {
      console.log(`App start listening to ${this._config.port}...`);
    });
  }
}

export { App };
