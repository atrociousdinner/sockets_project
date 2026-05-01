import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  create(dto: CreateTaskDto, userId: string, roomId: string) {
    const user_id = Number(userId);
    const room_id = Number(roomId);

    const task = this.taskRepo.create({
      ...dto,
      user: { user_id: user_id },
      room: { room_id: room_id },
    });

    return this.taskRepo.save(task);
  }

  async assign(taskId: string, userId: string) {
    const task_id = Number(taskId);
    const user_id = Number(userId);

    const updateTask = await this.taskRepo.update(
      {
        task_id: task_id,
        status: TaskStatus.TODO,
        assignee: IsNull(),
      },
      {
        status: TaskStatus.PENDING,
        assignee: { user_id: user_id },
      },
    );

    return this.taskRepo.findOne({
      where: {task_id: task_id}
    })

  }
}
