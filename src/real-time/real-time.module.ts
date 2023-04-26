import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { UsersModule } from 'src/users/users.module';
import { RealTimeGateway } from './real-time.gateway';

@Module({
  imports: [ChatModule, UsersModule, AuthModule],
  providers: [RealTimeGateway],
})
export class RealTimeModule {}
