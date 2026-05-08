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
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';

@Module({
  imports: [TaskModule, UserModule, RoomModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Task, Room],
    synchronize:true,
  }), AuctionModule, BidModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
