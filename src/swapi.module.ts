import { Module } from '@nestjs/common';
import { SwapiController } from './swapi.controller';
import { SwapiService } from './swapi.service';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import configuration from './config/configuration';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    // We can add rate limiting per resource, but there really is no point
    // swapi limits us to 10000 req a day, and we cache for a while so...
    ThrottlerModule.forRoot([
      {
        ttl: 60, // per minute
        limit: 50, // 50 requests
      },
    ]),
    HttpModule.register({ global: true }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            createKeyv(
              `redis://${configService.get('redis.host')}:${configService.get('redis.port')}`,
              {
                namespace: configService.get(
                  'redis.namespace',
                ),
              },
            ),
          ],
          // Star Wars data *PROBABLY* doesn't change THAT often
          // so 2 hours should be sufficient
          ttl: 2 * 60 * 60 * 1000,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [SwapiController],
  providers: [SwapiService],
})
export class SwapiModule {}
