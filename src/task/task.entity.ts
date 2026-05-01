import { Room } from "src/room/room.entity";
import { User } from "src/user/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";



export enum TaskStatus{
    TODO = 'todo',
    PENDING = 'pending',
    COMPLETED = 'completed'
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    task_id: number;

    @Column()
    task_name: string;

    @Column({
        type: 'varchar',
        default: TaskStatus.TODO
    })
    status: TaskStatus;

    @ManyToOne(() => Room, (room) => room.tasks)
    room: Room;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({name: 'creatorId'})
    user: User;

    @ManyToOne(() => User, {nullable: true})
    @JoinColumn({name: 'assigneeId'})
    assignee: User;
}