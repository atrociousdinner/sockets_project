import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { Auction } from 'src/auction/auction.entity';
import { User } from 'src/user/user.entity';
import { RoomModule } from 'src/room/room.module';
import { BidGateway } from './bid.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Auction, User]), RoomModule],
  controllers: [BidController],
  providers: [BidService, BidGateway],
})
export class BidModule {}
