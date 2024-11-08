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
  @Get()
  @ApiOperation({
    summary: "Returns all information about user except for password",
  })
  @UseGuards(JwtGuard)
  GetInfo(@Request() req: Request_type) {
    const id = req["user"]["sub"];
    const user = this.userService.getById(id);
    return user;
  }
  @Post("avatar")
  @ApiOperation({
    summary: "Change user's avatar",
  })
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor("avatar"))
  ChangeAvatar(
    @Request() req: Request_type,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const id = req["user"]["sub"];
    this.userService.changeAvatar(id, file);
    return "OK";
  }

  @Get("avatar")
  @ApiOperation({
    summary: "Get user's avatar",
  })
  @UseGuards(JwtGuard)
  GetAvatar(@Request() req: Request_type, @Response() res: Response_type) {
    const id = req["user"]["sub"];
    return this.userService.getAvatar(id, res);
  }

  @Get(":username")
  @ApiOperation({
    summary: "Get user by username(so far you should be signed in)",
  })
  @UseGuards(JwtGuard)
  GetUserByUsername(@Param("username") username: string) {
    const user = this.userService.getByUsernameUserController(username);
    return user;
  }

  @Patch()
  @ApiOperation({
    summary: "Update username, birth date, sex",
  })
  @UseGuards(JwtGuard)
  UpdateUser(@Request() req: Request_type, @Body() dto: UpdateUserDto) {
    const id = req["user"]["sub"];
    return this.userService.update(id, dto);
  }
}
