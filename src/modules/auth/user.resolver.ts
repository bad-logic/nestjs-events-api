import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger, UseGuards } from '@nestjs/common';
import { currentUser } from './current-user.decorator';
import { AuthGuardJwtGql } from './auth-guard-jwt.gql';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => User)
  @UseGuards(AuthGuardJwtGql)
  public me(@currentUser() user: User): User {
    return user;
  }

  @Query(() => [User])
  public async users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Query(() => User)
  public async user(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { id },
    });
  }

  @ResolveField('profile')
  public async profile(@Parent() user: User) {
    this.logger.debug(`@ResolveField profile was called`);
    return user.profile;
  }

  @ResolveField('events')
  public async events(@Parent() user: User) {
    this.logger.debug(`@ResolveField events was called`);
    return user.events;
  }

  @ResolveField('attended')
  public async attended(@Parent() user: User) {
    this.logger.debug(`@ResolveField attended was called`);
    return user.attended;
  }
}
