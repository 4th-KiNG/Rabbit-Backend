import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Patch,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/guard/jwt.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request as Request_type } from "express";
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

  @Post("banner")
  @ApiOperation({
    summary: "Change user's banner",
  })
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor("banner"))
  ChangeBanner(
    @Request() req: Request_type,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const id = req["user"]["sub"];
    this.userService.changeBanner(id, file);
    return "OK";
  }

  @Get(":userId")
  @ApiOperation({
    summary: "Get user by username(so far you should be signed in)",
  })
  @UseGuards(JwtGuard)
  GetUserByUsername(@Param("userId") userId: string) {
    const user = this.userService.getByUserId(userId);
    return user;
  }

  @Patch(":userId")
  @UseGuards(JwtGuard)
  SubscribeUser(
    @Request() req: Request_type,
    @Param("userId") userId: string,
    @Query("status") status: "subscribe" | "unsubscribe",
  ) {
    const id = req["user"]["sub"];
    return this.userService.subscribeUser(userId, id, status);
  }

  // @Patch()
  // @ApiOperation({
  //   summary: "Update username, birth date, sex",
  // })
  // @UseGuards(JwtGuard)
  // UpdateUser(@Request() req: Request_type, @Body() dto: UpdateUserDto) {
  //   const id = req["user"]["sub"];
  //   return this.userService.update(id, dto);
  // }
}
