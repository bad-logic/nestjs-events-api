import * as path from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Event } from '../modules/events/event.entity';
import { Attendee } from '../modules/events/attendee.entity';
import { User } from '../modules/auth/user.entity';
import { Profile } from '../modules/auth/profile.entity';
import environment from '../common/environment/environment';
import { DataSource } from 'typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: environment.dbHost,
  port: environment.dbPort,
  username: environment.dbUser,
  password: environment.dbPassword,
  database: environment.dbName,
  entities: [Event, Attendee, User, Profile],
  synchronize: false,
};

const dataSource = new DataSource({
  type: 'mysql',
  host: environment.dbHost,
  port: environment.dbPort,
  username: environment.dbUser,
  password: environment.dbPassword,
  database: environment.dbName,
  entities: [Event, Attendee, User, Profile],
  migrations: [path.join(__dirname, '/migrations/', '*.*')],
});

export default dataSource;
