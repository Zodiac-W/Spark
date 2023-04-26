import { OnModuleInit, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from 'src/auth/ws.jwt.auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { WsChatAuthGuard } from './guards/ws.chat.auth.guard';

@ApiTags('RealTimeGateway')
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtAuthGuard, WsChatAuthGuard)
export class RealTimeGateway implements OnModuleInit {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }
  @ApiOperation({ summary: 'Handle new message' })
  @SubscribeMessage('newMessage')
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const id = +client.handshake.query.chatId;
    const message_body = body.message_body;
    const senderId = body.senderId;
    const recipientId = body.recipientId;

    const createMessageDto = {
      message_body,
      chatId: id,
      senderId,
      recipientId,
    };

    // await this.chatService.createMessage(createMessageDto);

    console.log('Z:', createMessageDto);

    // CODE: to send message to all even the sender
    // this.server.emit('onMessage', {
    //   msg: 'New message',
    //   content: body.message_body,
    // });

    client.broadcast.emit('onMessage', {
      msg: 'New message',
      content: body.message_body,
    });
  }
}
