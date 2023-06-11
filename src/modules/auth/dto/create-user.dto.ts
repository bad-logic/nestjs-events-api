import { IsEmail, Length } from 'class-validator';
import { IsIdentical } from '../validators/is-identical.constraint';
import { DoesUserExists } from '../validators/user-exists.contraint';
import { Field, InputType } from '@nestjs/graphql';

@InputType('UserAddInput')
export class CreateUserDto {
  @Length(5)
  @DoesUserExists()
  @Field()
  username: string;

  @Length(8)
  @Field()
  password: string;

  @Length(8)
  @IsIdentical('password')
  @Field()
  retypedPassword: string;

  @Length(2)
  @Field()
  firstName: string;

  @Length(2)
  @Field()
  lastName: string;

  @IsEmail()
  @DoesUserExists()
  @Field()
  email: string;
}
