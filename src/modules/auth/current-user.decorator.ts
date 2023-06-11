import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const currentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);

    // works for graphql
    if (context) {
      return context.getContext().req.user ?? null;
    }

    // works for rest apis
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
