import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { } from "bcrypt";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      this.logger.log(`user ${username} not found`);
      throw new UnauthorizedException();
    }

    // if (bcrypt.hash(password) !== user.password) {
    //   this.logger.log(`user ${username} has wrong credentials`);
    //   throw new UnauthorizedException();
    // }

    return user;
  }
}
