import { Controller, Get, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':username')
    @UseGuards(JwtGuard)
    async getUserByUsername(@Param('username') username: string) {
        return await this.userService.getByUsername(username);
    }

}
