import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class WsChatAuthGuard implements CanActivate {
  constructor(private chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();

    if (!client.handshake.query.chatId) {
      throw Error('Handshake doesnt contain chat ID');
    }
    // console.log(client.handshake.user);

    const userId = client.handshake.user.userId;
    const id = client.handshake.query.chatId;
    const chatId = +id;
    console.log(chatId, userId);

    const canAccessChat = await this.chatService.userCanAccessChat(
      userId,
      chatId,
    );

    return canAccessChat;
  }
}
