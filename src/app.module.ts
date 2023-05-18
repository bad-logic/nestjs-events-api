import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: AppService, useClass: AppService }],
})
export class AppModule {}
