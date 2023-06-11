import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import environment from '../../common/environment/environment';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './users.controller';
import { UserResolver } from './user.resolver';

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
  controllers: [AuthController, UserController],
  providers: [LocalStrategy, JwtStrategy, AuthService, UserResolver],
})
export class AuthModule {}
