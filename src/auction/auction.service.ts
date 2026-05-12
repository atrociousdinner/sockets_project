import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction, AuctionStatus } from './auction.entity';
import { Repository } from 'typeorm';
import { Bid } from 'src/bid/bid.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
    @InjectRepository(Bid) private bidRepo: Repository<Bid>,
    private dataSource: DataSource,
  ) {}

  async create(
    title: string,
    status: AuctionStatus,
    starting_price: number,
    room_id: number,
  ) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const auctionRepo = manager.getRepository(Auction);
        const bidRepo = manager.getRepository(Bid);

        const auction = auctionRepo.create({
          title,
          status,
          starting_price,
          current_price: starting_price,
          room: { room_id },
        });

        const savedAuction = await auctionRepo.save(auction);

        const openingBid = bidRepo.create({
          auction: savedAuction,
          bidder: null,
          amount: starting_price,
          parentBid: null,
          isOpeningBid: true,
        });

        const savedOpeningBid = await bidRepo.save(openingBid);

        return {
          auction: savedAuction,
          openingBid: savedOpeningBid,
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
