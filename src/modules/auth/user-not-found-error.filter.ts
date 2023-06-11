import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements GqlExceptionFilter {
  catch(Exception: any, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    return new NotFoundException('Entity Not found');
  }
}
