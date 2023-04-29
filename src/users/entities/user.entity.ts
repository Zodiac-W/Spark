import { Block } from 'src/chat/entities/block.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Contact } from 'src/chat/entities/contact.entity';
import { Message } from 'src/chat/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_phone: string;

  @Column()
  user_pass: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.REGULAR_USER })
  user_role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Chat, (chat) => chat.user1)
  chats1: Chat[];

  @OneToMany((type) => Chat, (chat) => chat.user2)
  chats2: Chat[];

  @OneToMany((type) => Message, (message) => message.sender)
  messagesSent: Message[];

  @OneToMany((type) => Message, (message) => message.recipient)
  messagesReceived: Message[];

  @OneToMany((type) => Contact, (contact) => contact.user)
  contact: Contact[];

  @OneToMany((type) => Block, (block) => block.user)
  block: Block[];
}
