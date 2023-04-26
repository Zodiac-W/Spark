import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export class WsAuth implements CanActivate {
  constructor(private usersService: UsersService) {}

  canActivate(context: any): Promise<boolean> {
    const bearerToken =
      context.args[0].handShake.headers.authorization.split(' ')[1];

    return;
  }
}
