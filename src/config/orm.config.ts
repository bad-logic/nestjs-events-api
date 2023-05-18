import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { registerAs } from '@nestjs/config';
import { Attendee } from '../events/attendee.entity';
import { User } from '../auth/user.entity';
import { Profile } from '../auth/profile.entity';
import environment from '../utils/environment';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: environment.dbHost,
    port: environment.dbPort,
    username: environment.dbUser,
    password: environment.dbPassword,
    database: environment.dbName,
    entities: [Event, Attendee, User, Profile],
    synchronize: true,
  }),
);
