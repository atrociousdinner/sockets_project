import { Body, Controller, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dtos/createauction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Post('/create')
  createAuction(@Body() body: CreateAuctionDto) {
    return this.auctionService.create(
      body.title,
      body.starting_price,
      body.room_id,
    );
  }

  @Post('/start')
  startAuction(@Body('auction_id') auction_id: number) {
    return this.auctionService.start(auction_id);
  }
}
