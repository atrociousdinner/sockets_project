import { Bid } from 'src/bid/bid.entity';
import { Room } from 'src/room/room.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuctionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  auction_id: number;

  @Column()
  title: string;

  @Column({
    type: 'varchar',
    default: AuctionStatus.DRAFT,
  })
  status: AuctionStatus;

  @Column()
  starting_price: number;

  @Column()
  current_price: number;

  @ManyToOne(() => Room, (room) => room.auctions, { onDelete: 'CASCADE' })
  room: Room;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endsAt: Date;

  //   @OneToMany(() => User, (user) => user.room)
  //   users: User[];

  //   @OneToMany(() => Task, (task) => task.room)
  //   tasks: Task[];
}
