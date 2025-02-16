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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
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
