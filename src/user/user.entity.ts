import { Room } from "src/room/room.entity";
import { Task } from "src/task/task.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @ManyToOne(() => Room, (room) => room.users)
    room: Room;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

}