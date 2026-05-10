import { Auction } from 'src/auction/auction.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['auction', 'parentBid'], {unique: true})
export class Bid {
  @PrimaryGeneratedColumn()
  bid_id: number;

  @ManyToOne(() => Auction, (auction) => auction.bids, { onDelete: 'CASCADE' })
  auction: Auction;

  @ManyToOne(() => User, (user) => user.bids, { onDelete: 'CASCADE', nullable: true })
  bidder: User | null;

  @Column({type: 'decimal', precision: 10, scale: 2})
  amount: number;

  @ManyToOne(() => Bid, {nullable: true})
  parentBid: Bid | null;

  @Column({ default: false })
  isOpeningBid: boolean;

  @CreateDateColumn()
  createdAt: Date;

}
