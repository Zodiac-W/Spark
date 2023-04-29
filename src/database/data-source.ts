import { Block } from 'src/chat/entities/block.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Contact } from 'src/chat/entities/contact.entity';
import { Message } from 'src/chat/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  entities: [User, Chat, Message, Contact, Block],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: './migrations',
    subscribersDir: 'subscriber',
  },
} as DataSourceOptions);
