import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/message/dto/create-message-dto';
import { Message } from 'src/chat/entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat-dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private usersService: UsersService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<any> {
    const { user1Id, user2Id } = createChatDto;

    const user1 = await this.usersService.getOneUser(user1Id);
    const user2 = await this.usersService.getOneUser(user2Id);

    const chat = new Chat();

    chat.user1 = user1;
    chat.user2 = user2;

    await this.chatRepository.save(chat);

    return chat;
  }

  async getChat(id: number): Promise<any> {
    const chat = await this.chatRepository.findOne({ where: { id } });

    return chat;
  }

  async deleteChat(id: number): Promise<any> {
    const chat = await this.getChat(id);

    await this.chatRepository.softDelete(id);

    return chat;
  }

  async getChatUsers(id: number): Promise<any> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['user1', 'user2'],
    });
    const users = [chat.user1, chat.user2];

    return users;
  }

  async userCanAccessChat(userId: number, chatId: number): Promise<any> {
    const users = await this.getChatUsers(chatId);

    const user = users.find((user) => user.id === userId);

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<any> {
    const { message_body, chatId, senderId, recipientId } = createMessageDto;

    const chat = await this.getChat(chatId);
    const sender = await this.usersService.getOneUser(senderId);
    const recipient = await this.usersService.getOneUser(recipientId);

    const message = new Message();
    message.message_body = message_body;
    message.chat = chat;
    message.sender = sender;
    message.recipient = recipient;

    await this.messageRepository.save(message);

    return message;
  }

  async getMessage(id: number): Promise<any> {
    const message = await this.messageRepository.findOne({ where: { id } });

    return message;
  }

  async getMessageSender(id: number): Promise<any> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'],
    });

    const sender = message.sender;
    return sender;
  }

  async getMessageRecipient(id: number): Promise<any> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['recipient'],
    });

    const recipient = message.recipient;
    return recipient;
  }

  async deleteMessage(id: number): Promise<any> {
    const message = await this.getMessage(id);

    await this.messageRepository.softDelete(id);

    return message;
  }
}
