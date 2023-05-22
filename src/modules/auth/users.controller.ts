import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { Password } from './password';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    if (user.password !== user.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }
    const existingUser = await this.userRepository.findOne({
      where: [
        {
          username: user.username,
        },
        {
          email: user.email,
        },
      ],
    });
    if (existingUser) {
      throw new BadGatewayException(['user already exists']);
    }

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
