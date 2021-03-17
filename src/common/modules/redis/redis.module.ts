import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../../../config';
import { REDIS_OPTIONS } from './constants';
import { RedisService } from './services/redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_OPTIONS,
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export default class RedisModule {}
