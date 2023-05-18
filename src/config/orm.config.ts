import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Event } from '../modules/events/event.entity';
import { Attendee } from '../modules/events/attendee.entity';
import { User } from '../modules/auth/user.entity';
import { Profile } from '../modules/auth/profile.entity';
import environment from '../common/environment/environment';

export default (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: environment.dbHost,
  port: environment.dbPort,
  username: environment.dbUser,
  password: environment.dbPassword,
  database: environment.dbName,
  entities: [Event, Attendee, User, Profile],
  synchronize: true,
});
