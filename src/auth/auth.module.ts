import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import environment from '../utils/environment';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.register({
      secret: environment.jwtSecret,
      signOptions: {
        expiresIn: `${environment.jwtExpiresIn}m`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy],
})
export class AuthModule {}
