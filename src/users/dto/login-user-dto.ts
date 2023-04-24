import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The user email',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The user password',
    type: String,
  })
  @IsNotEmpty()
  user_pass: string;
}
