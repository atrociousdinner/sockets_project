import { Room } from "src/room/room.entity";
import { User } from "src/user/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    task_id: number;

    @Column()
    task_name: string;

    @Column()
    status: string;

    @ManyToOne(() => Room, (room) => room.tasks)
    room: Room;

    @ManyToOne(() => User, (user) => user.tasks)
    user: User;

    
}