import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import environment from './utils/environment';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    //   logger: ['error', 'warn', 'debug', 'log'],
    // }
  );
  app.useGlobalPipes(new ValidationPipe());
  console.log({ environment });
  await app.listen(environment.apiPort);
}
bootstrap();
