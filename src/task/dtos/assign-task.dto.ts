import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class AssignTaskDto{
    @IsNumber()
    @IsNotEmpty()
    taskId: number
}