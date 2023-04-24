import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_body: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Chat, (chat) => chat.message)
  chat: Chat;

  @ManyToOne((type) => User, (user) => user.messagesSent)
  sender: User;

  @ManyToOne((type) => User, (user) => user.messagesReceived)
  recipient: User;
}
