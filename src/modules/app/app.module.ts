import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../../config';

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    const imports = [ConfigModule];
    return {
      module: AppModule,
      imports,
      controllers: [AppController],
      providers: [AppService],
      exports: imports,
    };
  }
}
