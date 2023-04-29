import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';

@Injectable()
export class IsNotBlocked implements CanActivate {
  constructor(private chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const senderId = request.user.userId;
    const recipientId = request.params.recipientId;

    const isBlocked = await this.chatService.isBlocked(senderId, recipientId);

    return isBlocked;
  }
}
