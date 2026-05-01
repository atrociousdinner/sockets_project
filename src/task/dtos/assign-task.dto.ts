import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Task, TaskStatus } from "../task.entity";


export class AssignTaskDto{
    @IsString()
    @IsNotEmpty()
    taskId: string
}