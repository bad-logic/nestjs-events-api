import { Length, IsDateString, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(2, 255, {
    message: 'The name length should have at least 2 characters',
  })
  name: string;

  @IsString()
  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @IsString()
  @Length(2, 255)
  address: string;
}
