import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Block } from 'src/chat/entities/block.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Contact } from 'src/chat/entities/contact.entity';
import { Message } from 'src/chat/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions() {
    return {
      type: this.configService.get('database.type'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      synchronize: this.configService.get('database.synchronize'),
      entities: [User, Chat, Message, Contact, Block],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: './migrations',
        subscribersDir: 'subscriber',
      },
    };
  }
}
