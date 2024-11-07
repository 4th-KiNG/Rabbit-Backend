import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Patch,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
  Response,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/guard/jwt.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UpdateUserDto } from "src/dtos/user.dto";
import { Request as Request_type, Response as Response_type } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("avatar")
  @ApiOperation({
    summary: "Change user's avatar",
  })
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor("avatar"))
  async changeAvatar(
    @Request() req: Request_type,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const id = req["user"]["sub"];
    return await this.userService.changeAvatar(id, file);
  }

  @Get("avatar")
  @ApiOperation({
    summary: "Get user's avatar",
  })
  @UseGuards(JwtGuard)
  async getAvatar(
    @Request() req: Request_type,
    @Response() res: Response_type,
  ) {
    const id = req["user"]["sub"];
    return await this.userService.getAvatar(id, res);
  }

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
