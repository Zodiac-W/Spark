import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateMessageDto } from 'src/message/dto/create-message-dto';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat-dto';
import { AccessChat } from './guards/accessChat.guard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: 'Get Chat' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The chat',
    type: CreateChatDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get(':id')
  getChat(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getChat(id);
  }

  @ApiOperation({ summary: 'Get chat users' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the targer chat',
  })
  @ApiResponse({
    status: 200,
    description: 'List of chat users',
    type: [CreateUserDto],
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get('users/:id')
  getChatUsers(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getChatUsers(id);
  }

  @ApiOperation({ summary: 'Create new chat' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The chat',
    type: CreateChatDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Post('new')
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @ApiOperation({ summary: 'Delete chat by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted chat',
    type: CreateChatDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Delete('delete/:id')
  deleteChat(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.deleteChat(id);
  }

  // Message endpoints
  @ApiOperation({ summary: 'Get message by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiParam({
    name: 'messId',
    type: 'integer',
    description: 'The id of the target message',
  })
  @ApiResponse({
    status: 200,
    description: 'The message',
    type: CreateMessageDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get(':id/message/:messId')
  getMessage(@Param('messId', ParseIntPipe) messId: number) {
    return this.chatService.getMessage(messId);
  }

  @ApiOperation({ summary: 'Get message sender' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiParam({
    name: 'messId',
    type: 'integer',
    description: 'The id of the target message',
  })
  @ApiResponse({
    status: 200,
    description: 'The message sender',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get(':id/message/sender/:messId')
  getMessageSender(@Param('messId', ParseIntPipe) messId: number) {
    return this.chatService.getMessageSender(messId);
  }

  @ApiOperation({ summary: 'Get message recipient' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiParam({
    name: 'messId',
    type: 'integer',
    description: 'The id of the target message',
  })
  @ApiResponse({
    status: 200,
    description: 'The message recipient',
    type: CreateUserDto,
  })
  @Get(':id/message/recipient/:messId')
  getMessageRecipient(@Param('messId', ParseIntPipe) messId: number) {
    return this.chatService.getMessageRecipient(messId);
  }

  @ApiOperation({ summary: 'Create new message' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The message',
    type: CreateMessageDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Post(':id/message/new')
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(createMessageDto);
  }

  @ApiOperation({ summary: 'Delete message' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target message',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted message',
    type: CreateMessageDto,
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Delete(':id/message/delete/:messId')
  deleteMessage(@Param('messId', ParseIntPipe) messId: number) {
    return this.chatService.deleteMessage(messId);
  }
}
