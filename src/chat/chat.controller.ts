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
import { User } from 'src/decorators/user.decorator';
import { CreateMessageDto } from 'src/message/dto/create-message-dto';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat-dto';
import { AccessChat } from './guards/accessChat.guard';
import { DeleteMessage } from './guards/deleteMessage.guard';
import { IsBlocked } from './guards/isBlocked.guard';
import { IsNotBlocked } from './guards/isNotBlocked.guard';

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

  @ApiOperation({ summary: 'Get user chats' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of chats',
    type: [CreateChatDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/chats')
  getUserChats(@User() user: any) {
    return this.chatService.getUserChats(user.userId);
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
  @UseGuards(JwtAuthGuard, IsNotBlocked)
  @Post('new/:recipientId')
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
  @ApiOperation({ summary: 'Get All chat messages' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the target chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The chat messages',
    type: [CreateMessageDto],
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get(':id/message')
  getAllMessages(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getAllMessages(id);
  }

  @ApiOperation({ summary: 'Get all sent messages' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The id of the target chat',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'All messages user sent',
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get(':id/message/sent')
  getSentMessages(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.chatService.getSentMessages(user.userId, id);
  }

  @ApiOperation({ summary: 'Get all recieved messages' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The id of the target chat',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'All messages user recieved',
  })
  @UseGuards(JwtAuthGuard, AccessChat)
  @Get(':id/message/recieved')
  getRecievedMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: any,
  ) {
    return this.chatService.getRecievedMessages(user.userId, id);
  }

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
  @UseGuards(JwtAuthGuard, AccessChat, IsNotBlocked)
  @Post(':id/message/new/:recipientId')
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
  @UseGuards(JwtAuthGuard, AccessChat, DeleteMessage)
  @Delete(':id/message/delete/:messId')
  deleteMessage(@Param('messId', ParseIntPipe) messId: number) {
    return this.chatService.deleteMessage(messId);
  }

  @ApiOperation({ summary: 'Add new contact to user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The added contact',
  })
  @UseGuards(JwtAuthGuard)
  @Post('contact/new')
  addToContactList(@Body('phoneNumber') phone: string, @User() user: any) {
    return this.chatService.addToContactList(user.userId, phone);
  }

  @ApiOperation({ summary: 'Get all user contacts' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of user contacts',
  })
  @UseGuards(JwtAuthGuard)
  @Get('contact/all')
  getUserContact(@User() user: any) {
    return this.chatService.getUserContact(user.userId);
  }

  @ApiOperation({ summary: 'Block a user' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The id of the user that will be blocked',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'The blocked user',
  })
  @UseGuards(JwtAuthGuard, IsNotBlocked)
  @Post('block/:id')
  addToBlockList(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.chatService.addToBlockList(user.userId, id);
  }

  @ApiOperation({ summary: 'List of users block list' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of blocked users',
  })
  @UseGuards(JwtAuthGuard)
  @Get('block/all')
  getUserBlockList(@User() user: any) {
    return this.chatService.getUserBlockList(user.userId);
  }

  @ApiOperation({ summary: 'Unblock a user' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'blockedId',
    description: 'The id of the user that will be unblocked',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'The unblocked user',
  })
  @UseGuards(JwtAuthGuard, IsBlocked)
  @Delete('block/unblock/:blockedId')
  unblockUser(
    @Param('blockedId', ParseIntPipe) blockedId: number,
    @User() user: any,
  ) {
    return this.chatService.unblockUser(user.userId, blockedId);
  }
}
