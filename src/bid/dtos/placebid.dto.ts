import { IsNumber} from "class-validator";


export class PlaceBidDto{
    @IsNumber()
    auction_id: number;

    @IsNumber()
    user_id: number;

    @IsNumber()
    bidAmount: number;

    @IsNumber()
    parentBidId: number;
}