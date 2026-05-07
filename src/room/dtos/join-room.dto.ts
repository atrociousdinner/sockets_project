import { IsNumber, IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  room_name: string;

  @IsString()
  password: string;

  @IsNumber()
  user_id: number;
}
