import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import environment from './common/environment/environment';
import { EntityNotFoundErrorFilter } from './modules/auth/user-not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    //   logger: ['error', 'warn', 'debug', 'log'],
    // }
  );
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(environment.apiPort);
  console.log({ environment });
}
bootstrap();
