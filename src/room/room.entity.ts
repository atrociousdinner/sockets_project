import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';
import { Auction } from 'src/auction/auction.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column()
  room_name: string;

  @Column()
  room_password: string;

  @OneToMany(() => User, (user) => user.room)
  users: User[];

  @OneToMany(() => Task, (task) => task.room)
  tasks: Task[];

  @OneToMany(() => Auction, (auction) => auction.room)
  auctions: Auction[]
}
