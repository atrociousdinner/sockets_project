import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){

    }

    @Post('/create')
    createUser(@Body() body: CreateUserDto){
        this.userService.create(body.user_name)
    }
}
