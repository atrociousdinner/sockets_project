import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Task } from './task/task.entity';
import { Room } from './room/room.entity';

@Module({
  imports: [TaskModule, UserModule, RoomModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Task, Room],
    synchronize:true,
  })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
