import { IsNumber, isNumber, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsNumber()
  user_id: number;
}
