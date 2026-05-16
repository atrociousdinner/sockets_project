import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './auction.entity';
import { Bid } from 'src/bid/bid.entity';
import { AuctionSchedulerService } from './auction-scheduler.service';
import { AuctionGateway } from './auction.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Bid])],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionSchedulerService, AuctionGateway],
})
export class AuctionModule {}
