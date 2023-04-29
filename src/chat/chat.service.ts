import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/message/dto/create-message-dto';
import { Message } from 'src/chat/entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat-dto';
import { Chat } from './entities/chat.entity';
import { Contact } from './entities/contact.entity';
import { Block } from './entities/block.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private usersService: UsersService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Contact)
    private contactReposiroty: Repository<Contact>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
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

  async getUserChats(id: number): Promise<any> {
    const chats1 = await this.chatRepository.find({
      where: { user1: { id } },
    });
    const chats2 = await this.chatRepository.find({
      where: { user2: { id } },
    });

    const chats = [...chats1, ...chats2];

    return chats;
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

  async getAllMessages(id: number): Promise<any> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['message', 'message.sender', 'message.recipient'],
    });

    const messages = chat.message;

    return messages;
  }

  async getMessagesType(userId: number, chatId: number): Promise<any> {
    const messages = await this.getAllMessages(chatId);

    const sent = [];
    const recieved = [];
    console.log('1');
    messages.forEach((message) => {
      if (message.sender.id == userId) {
        sent.push(message);
      } else if (message.recipient.id == userId) {
        recieved.push(message);
      }
    });

    return { sent, recieved };
  }

  async getSentMessages(userId: number, chatId: number): Promise<any> {
    const messages = await this.getMessagesType(userId, chatId);

    const sent = messages.sent;

    return sent;
  }

  async getRecievedMessages(userId: number, chatId: number): Promise<any> {
    const messages = await this.getMessagesType(userId, chatId);

    const recieved = messages.recieved;

    return recieved;
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

  async addToContactList(id: number, phone: string): Promise<any> {
    const user = await this.usersService.getOneUser(id);
    const contact = await this.usersService.getUserByPhone(phone);

    const newContact = new Contact();
    newContact.contact_phone_numnber = phone;
    newContact.user = user;
    newContact.contact = contact;

    await this.contactReposiroty.save(newContact);

    return newContact;
  }

  async getUserContact(id: number): Promise<any> {
    const contacts = await this.contactReposiroty.find({
      where: { user: { id } },
      relations: ['contact'],
    });

    return contacts;
  }

  async usersSentMessage(userId: number, messId: number): Promise<any> {
    const message = await this.messageRepository.findOne({
      where: { id: messId },
      relations: ['sender'],
    });
    if (userId == message.sender.id) {
      return true;
    } else {
      return false;
    }
  }

  async addToBlockList(userId: number, blockedId: number): Promise<any> {
    const user = await this.usersService.getOneUser(userId);
    const blockedUser = await this.usersService.getOneUser(blockedId);

    const block = new Block();
    block.user = user;
    block.blocked = blockedUser;

    await this.blockRepository.save(block);

    return block;
  }

  async getUserBlockList(id: number): Promise<any> {
    const blocked = await this.blockRepository.find({
      where: { user: { id } },
      relations: ['blocked'],
    });
    return blocked;
  }

  async unblockUser(userId: number, blockedId: number): Promise<any> {
    const blocked = await this.blockRepository.findOne({
      where: { user: { id: userId }, blocked: { id: blockedId } },
    });
    const deleted = blocked;

    await this.blockRepository.softDelete(blocked.id);

    return deleted;
  }

  async isBlocked(senderId: number, recipientId: number): Promise<any> {
    const blockList = await this.getUserBlockList(recipientId);

    const isBlocked = blockList.find((user: any) => {
      return user.blocked.id == senderId;
    });
    if (isBlocked) {
      return false;
    } else {
      return true;
    }
  }
}
