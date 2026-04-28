import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskGateway } from './task.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({
  providers: [TaskService, TaskGateway],
  controllers: [TaskController],
  imports:[RoomModule]
})
export class TaskModule {}
