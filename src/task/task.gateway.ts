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

@WebSocketGateway(3001, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    client.to(roomId).emit('userJoined', {
      userId: client.id,
      roomId,
    });
    return { joined: roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() roomId: string,
  @ConnectedSocket() client: Socket) {
    client.leave(roomId);
    client.to(roomId).emit('userLeft', { userId: client.id });

    return { left: roomId };
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(@MessageBody() data:{roomId: string, message: string}, @ConnectedSocket() client: Socket){



    if (!client.rooms.has(data.roomId)) {
        return { error: 'Not a member of this room' };
      }
   
    // Broadcast to all room members including sender
    this.server.to(data.roomId).emit('roomMessage', {
        userId: client.id,
        message: data.message,
        timestamp: new Date().toISOString(),
      });

    return {message_sent: true}
  }

}
