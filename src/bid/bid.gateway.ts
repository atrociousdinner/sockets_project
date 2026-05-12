import {
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BidService } from './bid.service';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway(3001, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class BidGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private bidService: BidService,

    private roomService: RoomService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    const userId = Number(client.handshake.query.userId as string);

    if (!userId) {
      console.log(`Anonymous connection`);
      return;
    }

    client.data.userId = Number(userId);

    console.log(`Socket ${client.id} linked to user ${userId}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    try {
      const isAuthorized = await this.roomService.isUserInRoom(userId, roomId);
      if (!isAuthorized) {
        throw new UnauthorizedException(`Not authorized to enter the room`);
      }

      client.join(String(roomId));
      (client.to(String(roomId)).emit('userJoined'),
        {
          userId,
          roomId,
        });

      return {
        joined: 'successful',
      };
    } catch (err) {
      console.error('CRASH in handleJoinRoom', err.message);
      return { err: 'Internal Server error' };
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(String(roomId));
    client.to(String(roomId)).emit('userLeft', { userId: client.id });

    return { left: roomId };
  }
}
