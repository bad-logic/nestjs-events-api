import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
}

export interface PaginationResult<T> {
  current: number;
  last: number;
  limit: number;
  total?: number;
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const [data, count] = await qb
    .limit(options.limit)
    .offset(offset)
    .getManyAndCount();
  return {
    current: options.currentPage,
    last: Math.ceil(count / options.limit),
    limit: options.limit,
    total: count,
    data,
  };
}
