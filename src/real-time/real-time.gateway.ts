import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtAuthGuard } from 'src/auth/ws.jwt.auth.guard';
import { WsChatAuthGuard } from './guards/ws.chat.auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtAuthGuard, WsChatAuthGuard)
export class RealTimeGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }
  @UseGuards(WsJwtAuthGuard, WsChatAuthGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log('BODY:');
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New message',
      content: body,
    });
  }
}
