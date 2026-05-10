import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AuctionStatus } from "../auction.entity";


export class CreateAuctionDto{
    @IsString()
    title: string;


    @IsEnum(AuctionStatus, {
        message: 'Status must be either: draft, active or closed'
    })
    @IsOptional()
    status: AuctionStatus;
    
    @IsNumber()
    starting_price: number;

    //For now before moving on to sockets

    @IsNumber()
    room_id: number;
}