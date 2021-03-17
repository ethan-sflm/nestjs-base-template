import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../../config';
import { FixtureService } from './services/fixture.service';

@Module({
  imports: [
    ConfigModule,
    NestTypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('mysql'),
      inject: [ConfigService],
    }),
  ],
  providers: [FixtureService, ConfigService],
  exports: [FixtureService],
})
export class MysqlModule {}
