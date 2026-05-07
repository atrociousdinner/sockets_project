import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(user_name: string) {
    const user = this.userRepo.create({ user_name });
    return this.userRepo.save(user);
  }

  delete(user_id: number) {
    return this.userRepo.delete(user_id);
  }
}
