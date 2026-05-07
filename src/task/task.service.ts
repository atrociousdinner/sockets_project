import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async create(dto: CreateTaskDto, userId: number, roomId: number) {
    const task = await this.taskRepo.create({
      ...dto,
      user: { user_id: userId },
      room: { room_id: roomId },
    });

    return this.taskRepo.save(task);
  }

  async assign(taskId: number, userId: number) {
     await this.taskRepo.update(
      {
        task_id: taskId,
        status: TaskStatus.TODO,
        assignee: IsNull(),
      },
      {
        status: TaskStatus.PENDING,
        assignee: { user_id: userId },
      },
    );

    return this.taskRepo.findOne({
      where: { task_id: taskId },
    });
  }

  async attempt(taskId: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { task_id: taskId },
      relations: ['assignee'],
    });

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    if (!task.assignee || task.assignee.user_id !== userId) {
      throw new UnauthorizedException('Only the assignee can attempt this task');
    }

    const random = Math.random() < 0.5;
    const status = random ? TaskStatus.COMPLETED : TaskStatus.FAILED;

    await this.taskRepo.update(
      { task_id: taskId },
      { status },
    );

    return this.taskRepo.findOne({
      where: { task_id: taskId },
    });
  }

}
