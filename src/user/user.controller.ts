import { Controller, Get, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':username')
    async getUserByUsername(@Param('username') username: string) {
        return await this.userService.getByUsername(username);
    }

}
