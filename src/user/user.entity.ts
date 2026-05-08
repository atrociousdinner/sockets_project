import { Bid } from 'src/bid/bid.entity';
import { Room } from 'src/room/room.entity';
import { Task } from 'src/task/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_name: string;

  @ManyToOne(() => Room, (room) => room.users, { onDelete: 'CASCADE' })
  room: Room;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];
}
