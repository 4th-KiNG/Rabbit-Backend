import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/guard/jwt.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

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
}
