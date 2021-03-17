import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../../config';
import { FixtureService } from './services';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get('mongo.uri'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [FixtureService],
  exports: [FixtureService],
})
export class MongoModule {}
