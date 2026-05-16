import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction, AuctionStatus } from 'src/auction/auction.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AuctionSchedulerService {
  private readonly logger = new Logger(AuctionSchedulerService.name);

  constructor(
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
  ) {}

  @Interval(1000)
  async closeExpiredAuctions() {
    const expiredAuctions = await this.auctionRepo.find({
      where: {
        status: AuctionStatus.ACTIVE,
        endsAt: LessThanOrEqual(new Date()),
      },
    });

    for (const auction of expiredAuctions) {
      auction.status = AuctionStatus.CLOSED;
      await this.auctionRepo.save(auction);
      this.logger.log(`Closed auction ${auction.auction_id}`);
    }
  }
}
