import { IsNumber, IsString } from "class-validator";


export class DeleteRoomDto {
    @IsNumber()
    room_id: number;
}