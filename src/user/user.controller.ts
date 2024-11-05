import {
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  Body,
  Request,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/guard/jwt.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UpdateUserDto } from "src/dtos/user.dto";
import { Request as Request_type } from "express";
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":username")
  @ApiOperation({
    summary: "Get user by username(so far you should be signed in)",
  })
  @UseGuards(JwtGuard)
  async getUserByUsername(@Param("username") username: string) {
    const user = await this.userService.getByUsername(username);
    delete user.email;
    delete user.password;
    return user;
  }

  @Patch()
  @ApiOperation({
    summary: "Update username, birth date, sex",
  })
  @UseGuards(JwtGuard)
  async updateUser(@Request() req: Request_type, @Body() dto: UpdateUserDto) {
    const id = req["user"]["sub"];
    return await this.userService.update(id, dto);
  }
}
