import { IsString } from "class-validator";


export class CreateRoomDto{
    @IsString()
    room_name: string;


    @IsString()
    password: string;
}