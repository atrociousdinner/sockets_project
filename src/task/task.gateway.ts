import { UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway(3001, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private roomsService: RoomService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    const userId = client.handshake.query.userId as string;

    if (!userId) {
      console.log('Anonymous connection');
      return;
    }

    client.data.userId = userId;

    console.log(`Socket ${client.id} linked to User ${userId}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('joinRoom event received for room:', roomId);
    const userId = client.data.userId;

    try {
      const isAuthorized = await this.roomsService.isUserInRoom(userId, roomId);
      // console.log(`Authorization status: `, isAuthorized);

      if (!isAuthorized) {
        throw new UnauthorizedException(`Not authorized to enter the room`);
      }

      client.join(roomId);
      console.log(`User ID: ${userId} has joined the room`);

      client.to(roomId).emit('userJoined', {
        userId: client.id,
        roomId,
      });

      return {
        joined: roomId,
      };
    } catch (error) {
      console.error(`CRASH in handleJoinRoom:`, error.message);
      return { error: 'Internal Server Error' };
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    client.to(roomId).emit('userLeft', { userId: client.id });

    return { left: roomId };
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.rooms.has(data.roomId)) {
      return { error: 'Not a member of this room' };
    }

    // Broadcast to all room members including sender
    this.server.to(data.roomId).emit('roomMessage', {
      userId: client.id,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return { message_sent: true };
  }
}
