import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { SignUpUser } from 'src/users/interfaces';

export class AuthDto implements SignUpUser {
  @ApiProperty({
    description: 'Email address',
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'jhon doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Password between 6 and 32 characters',
    example: 'password',
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @ApiProperty({
    description: 'Repeat password',
    example: 'password',
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  repeatPassword: string;
}
