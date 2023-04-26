import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';

@Injectable()
export class AccessChat implements CanActivate {
  constructor(private chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const chatId = request.params.id;

    console.log(userId, chatId);

    const canAccessChat = await this.chatService.userCanAccessChat(
      userId,
      chatId,
    );
    return canAccessChat;
  }
}
