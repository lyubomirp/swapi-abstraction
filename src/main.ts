import { NestFactory } from '@nestjs/core';
import { SwapiModule } from './swapi.module';
import {
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SwapiModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: [
      'http://localhost:3000', // Dev
      'http://frontend:3000', // FE Container name
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(
    `SWAPI is running on: http://localhost:${process.env.PORT}`,
  );
}

void bootstrap();
