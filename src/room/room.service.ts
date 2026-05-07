import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  create(room_name: string, room_password: string) {
    const room = this.roomRepo.create({ room_name, room_password });
    return this.roomRepo.save(room);
  }

  async join(room_name: string, room_password: string, userId: number) {
    const room = await this.roomRepo.findOne({
      where: { room_name: room_name },
    });

    if (!room) {
      throw new NotFoundException(`Room: ${room_name} not found.`);
    }

    if (room.room_password != room_password) {
      throw new UnauthorizedException(`Access denied. Invalid room password.`);
    }

    await this.userRepo.update(userId, {
      room: room,
    });
  }

  async isUserInRoom(userId: number, roomId: number) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['room'],
    });

    return user?.room?.room_id === roomId;
  }

  async delete(room_id: number) {
    const result = await this.roomRepo.delete(room_id);

    return {
      success: true,
      message: `Room ${room_id} successfully deleted`,
    };
  }
}
