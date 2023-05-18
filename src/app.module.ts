import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './modules/events/events.module';
import ormConfig from './config/orm.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig(),
    }),
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: AppService, useClass: AppService }],
})
export class AppModule {}
