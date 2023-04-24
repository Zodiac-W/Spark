import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The user name',
    type: String,
  })
  @IsNotEmpty()
  @Length(4, 40)
  user_name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The user email',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({
    example: '01234567',
    description: 'The user phone number',
    type: String,
  })
  @IsNotEmpty()
  user_phone: string;

  @ApiProperty({
    example: 'Pssword123!',
    description: 'The user password',
    type: String,
  })
  @IsNotEmpty()
  @IsStrongPassword()
  user_pass: string;

  @ApiProperty({
    example: UserRole.SUPER_USER,
    enum: UserRole,
    description: 'The user role',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  user_role: UserRole;
}
