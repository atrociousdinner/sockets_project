import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './room.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UserModule],
  providers: [RoomService],
  controllers: [RoomController],
  exports:[RoomService]
})
export class RoomModule {}
