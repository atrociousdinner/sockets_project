
import { Bid } from 'src/bid/bid.entity';
import { Room } from 'src/room/room.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';

export enum AuctionStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    CLOSED = 'closed'
}


@Entity()
export class Auction {
  @PrimaryColumn()
  auction_id: string;

  @Column()
  title: string;

  @Column({
    type: 'varchar',
    default: AuctionStatus.DRAFT
  })
  status: AuctionStatus;

  @Column()
  starting_price: number;

  @Column()
  current_price: number;

  @ManyToOne(() => Room, (room) => room.auctions, {onDelete: 'CASCADE'})
  room: Room;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[]



//   @OneToMany(() => User, (user) => user.room)
//   users: User[];

//   @OneToMany(() => Task, (task) => task.room)
//   tasks: Task[];
}
