import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskGateway } from './task.gateway';
import { RoomModule } from 'src/room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
  providers: [TaskService, TaskGateway],
  controllers: [TaskController],
  imports:[RoomModule, TypeOrmModule.forFeature([Task])]
  
})
export class TaskModule {}
