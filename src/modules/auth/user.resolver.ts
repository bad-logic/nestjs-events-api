import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => [User])
  public async users(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile', 'events', 'attended'],
    });
  }

  @Query(() => User)
  public async user(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: ['profile', 'events', 'attended'],
    });
  }
}
