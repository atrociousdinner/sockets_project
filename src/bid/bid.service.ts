import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { Auction } from 'src/auction/auction.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid) private bidRepo: Repository<Bid>,
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async placeBid(auction_id: number, user_id: number, bidAmount: number, parentBidId: number | null) {
    const auction = await this.auctionRepo.findOne({
        where: {auction_id: auction_id}
    })
    
    if(!auction){
        throw new NotFoundException(`The auction ${auction} doesn't exist`)
    }

    const user = await this.userRepo.findOne({
        where: {user_id: user_id}
    })

    if(!user){
        throw new NotFoundException(`The user ${user} doesn't exist`)
    }

    if(!parentBidId){

    }

    const bid = await this.bidRepo.create({
        auction: {auction_id: auction_id},
        bidder: {user_id: user_id},
        amount: bidAmount,
        parentBid: {bid_id: parentBidId}
    })

  }

}
