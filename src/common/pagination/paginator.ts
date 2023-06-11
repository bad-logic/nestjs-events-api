import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
}

export function Paginated<T>(classRef: Type) {
  @ObjectType()
  class PaginationResult<T> {
    constructor(partial: Partial<PaginationResult<T>>) {
      Object.assign(this, partial);
    }

    @Field({ nullable: true })
    current: number;

    @Field({ nullable: true })
    last: number;

    @Field({ nullable: true })
    limit: number;

    @Field({ nullable: true })
    total?: number;

    @Field(() => [classRef], { nullable: true })
    data: T[];
  }

  return PaginationResult<T>;
}

export async function paginate<T, K>(
  qb: SelectQueryBuilder<T>,
  classRef: Type<K>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<K> {
  const offset = (options.currentPage - 1) * options.limit;
  const [data, count] = await qb
    .limit(options.limit)
    .offset(offset)
    .getManyAndCount();

  return new classRef({
    current: options.currentPage,
    last: Math.ceil(count / options.limit),
    limit: options.limit,
    total: count,
    data,
  });
}
