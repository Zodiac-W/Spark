import { Message } from 'src/chat/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.chats1)
  user1: User;

  @ManyToOne((type) => User, (user) => user.chats2)
  user2: User;

  @OneToMany((type) => Message, (message) => message.chat)
  message: Message[];
}
