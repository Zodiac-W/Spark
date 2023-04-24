import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    example: 5,
    description: 'The first user id',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  user1Id: number;

  @ApiProperty({
    example: 5,
    description: 'The second user id',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  user2Id: number;
}
