import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { Auction } from 'src/auction/auction.entity';
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid) private bidRepo: Repository<Bid>,
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async placeBid(
    auction_id: number,
    user_id: number,
    bidAmount: number,
    parentBidId: number,
  ) {
    const auction = await this.auctionRepo.findOne({
      where: { auction_id },
    });

    if (!auction) {
      throw new NotFoundException(`The auction ${auction} doesn't exist`);
    }

    const user = await this.userRepo.findOne({
      where: { user_id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`The user ${user} doesn't exist`);
    }

    if (bidAmount <= Number(auction.current_price)) {
      throw new ConflictException(
        `Bid amount must be higher than the current price`,
      );
    }

    const parentBid = await this.bidRepo.findOne({
      where: {
        bid_id: parentBidId,
        auction: { auction_id },
      },
      relations: ['auction'],
    });

    if (!parentBid) {
      throw new NotFoundException(`Parent bid not found`);
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const bidRepo = manager.getRepository(Bid);
        const auctionRepo = manager.getRepository(Auction);

        const bid = bidRepo.create({
          auction,
          bidder: user,
          amount: bidAmount,
          parentBid,
        });

        const savedBid = await bidRepo.save(bid);

        await auctionRepo.update({ auction_id }, { current_price: bidAmount });

        return savedBid;
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`You have been outbid`);
      }

      throw error;
    }
  }

  async getLatestBid(auction_id: number) {
    return await this.bidRepo.findOne({
      where: { auction: { auction_id } },
      order: { bid_id: 'DESC' },
    });
  }
}
