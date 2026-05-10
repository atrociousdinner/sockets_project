import { Body, Controller, Post } from '@nestjs/common';
import { BidService } from './bid.service';
import { PlaceBidDto } from './dtos/placebid.dto';

@Controller('bid')
export class BidController {

    constructor(private bidService: BidService) {
        
    }

    @Post('/place')
    placeBid(@Body() body: PlaceBidDto) {
        return this.bidService.placeBid(
            body.auction_id,
            body.user_id,
            body.bidAmount,
            body.parentBidId
        )
    }


}
