import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Profile } from './profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { Password } from './password';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  public async createUser(user: CreateUserDto) {
    // create profile
    const profile = new Profile();
    profile.firstName = user.firstName;
    profile.lastName = user.lastName;

    // create user
    const newUser = new User();
    newUser.email = user.email;
    newUser.username = user.username;
    newUser.password = await new Password(user.password).hash();
    newUser.profile = profile;

    const { password, ...rest } = await this.userRepository.save(newUser);
    return rest;
  }
}
