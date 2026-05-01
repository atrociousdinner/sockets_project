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
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { AssignTaskDto } from './dtos/assign-task.dto';

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
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private roomsService: RoomService,
    private tasksService: TaskService,
  ) {}

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
    client.data.roomId = roomId;

    try {
      const isAuthorized = await this.roomsService.isUserInRoom(userId, roomId);
      // console.log(`Authorization status: `, isAuthorized);

      if (!isAuthorized) {
        throw new UnauthorizedException(`Not authorized to enter the room`);
      }

      client.join(roomId);
      console.log(`User ID: ${userId} has joined the room ${roomId}`);

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
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = [...client.rooms].filter((room) => room !== client.id);

    try {
      client.to(room[0]).emit('roomMessage', {
        userId: client.id,
        message: data.message,
        timestamp: new Date().toISOString(),
      });

      return { message_sent: true };
    } catch (error) {
      console.error('Error in sending message', error);
    }
  }

  @SubscribeMessage('task:create')
  handletaskCreation(
    @MessageBody() dto: CreateTaskDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = [...client.rooms].filter((room) => room !== client.id);

    try {
      if (room.length != 1) {
        throw new UnauthorizedException(
          'You can only join one room at a time!',
        );
      }

      const userId = client.data.userId;
      const roomId = client.data.roomId;

      this.tasksService.create(dto, userId, roomId);

      client.to(room[0]).emit('task:create', {
        ...dto,
        userId,
        roomId,
      });

      return {
        task_created: true,
      };
    } catch (error) {
      console.error(`Error in creating task:`, error);
    }
  }

  @SubscribeMessage('task:assign')
  async handletaskAssignment(
    @MessageBody() dto: AssignTaskDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = [...client.rooms].filter((room) => room !== client.id);

    try {
      const userId = client.data.userId;

      const assignedTask = await this.tasksService.assign(dto.taskId, userId);

      if (room.length > 0) {
        client.to(room[0]).emit('task:assigned', assignedTask);
      }

      return {
        task_assigned: true,
        task: assignedTask,
      };
    } catch (error) {
      console.error(`Error in assigning task:`, error);
      return { error: error.message };
    }
  }

}
