import { IsEmail, Length } from 'class-validator';
import { IsIdentical } from '../validators/is-identical.constraint';
import { DoesUserExists } from '../validators/user-exists.contraint';

export class CreateUserDto {
  @Length(5)
  @DoesUserExists()
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  @IsIdentical('password')
  retypedPassword: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail()
  @DoesUserExists()
  email: string;
}
