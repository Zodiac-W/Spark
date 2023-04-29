import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';

@Injectable()
export class IsBlocked implements CanActivate {
  constructor(private chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const blockedId = request.params.blockedId;

    const isBlocked = await this.chatService.isBlocked(blockedId, userId);

    return !isBlocked;
  }
}
