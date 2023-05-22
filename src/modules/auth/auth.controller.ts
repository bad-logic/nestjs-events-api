import { Controller, Post, UseGuards, Inject, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { currentUser } from './current-user.decorator';
import { User } from './user.entity';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthGuardJwt } from './auth-guard.jwt';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  // @UseGuards(AuthGuard('local'))
  @UseGuards(AuthGuardLocal)
  async login(@currentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuardJwt)
  async getProfile(@currentUser() user: User) {
    return user;
  }
}
