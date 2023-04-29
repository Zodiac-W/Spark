import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';

@Injectable()
export class DeleteMessage implements CanActivate {
  constructor(private chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const messId = request.params.messId;

    const canDelete = await this.chatService.usersSentMessage(userId, messId);

    return canDelete;
  }
}
