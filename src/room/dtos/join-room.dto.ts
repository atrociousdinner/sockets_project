import { IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  room_name: string;

  @IsString()
  password: string;

  @IsString()
  user_id: string;
}
