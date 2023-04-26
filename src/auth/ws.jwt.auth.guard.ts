import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();

    //Check if the request is authorized
    if (!client.handshake.headers.authorization) {
      throw Error('Handshake is not authorized');
    }

    const payload = await this.authService.validateWs(
      client.handshake.headers.authorization.split(' ')[1],
    );
    client.handshake.user = { userId: payload.sub };

    console.log('User id:', client.handshake.user.userId);

    if (client.handshake.user) {
      return true;
    } else {
      return false;
    }
  }
}
