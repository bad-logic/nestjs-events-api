import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TokenOutput } from './dto/token.output';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginInput }) input: LoginInput,
  ): Promise<TokenOutput> {
    const user = await this.authService.validateUser(
      input.username,
      input.password,
    );
    const token = this.authService.getTokenForUser(user);
    return new TokenOutput({ token });
  }
}
