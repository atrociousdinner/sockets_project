import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Task, TaskStatus } from "../task.entity";


export class CreateTaskDto{
    @IsString()
    @IsNotEmpty()
    task_name: string;


    @IsEnum(TaskStatus, {
        message: 'Status must be either: todo, in_progress, or done'
    })
    @IsOptional()
    status: TaskStatus;
}