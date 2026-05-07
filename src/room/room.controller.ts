import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomService } from './room.service';
import { JoinRoomDto } from './dtos/join-room.dto';
import { DeleteRoomDto } from './dtos/delete-room.dto';

@Controller('room')
export class RoomController {
  constructor(private roomsService: RoomService) {}

  @Post('/create')
  createRoom(@Body() body: CreateRoomDto) {
    this.roomsService.create(body.room_name, body.password);
  }

  @Post('/enter')
  async enterRoom(@Body() body: JoinRoomDto) {
    return await this.roomsService.join(
      body.room_name,
      body.password,
      Number(body.user_id),
    );
  }

  @Post('/delete')
  async deleteRoom(@Body() body: DeleteRoomDto) {
    return await this.roomsService.delete(Number(body.room_id));
  }
}
