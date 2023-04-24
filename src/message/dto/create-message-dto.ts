import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Hello from user one',
    description: 'The message body that will be displayed',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  message_body: string;

  @ApiProperty({
    example: 4,
    description: 'The chat room id',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  chatId: number;

  @ApiProperty({
    example: 5,
    description: 'The sender id',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @ApiProperty({
    example: 9,
    description: 'The recipient id',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  recipientId: number;
}
