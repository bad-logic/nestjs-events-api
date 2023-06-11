import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    return this.userService.createUser(user);
  }
}
