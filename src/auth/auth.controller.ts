import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { SignInDto } from "src/dtos/signin.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { JwtGuard } from "src/guard/jwt.guard";
import { UserService } from "src/user/user.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @Post("signup")
  @ApiOperation({ summary: "Sign Up" })
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post("signin")
  @ApiOperation({ summary: "Sign In" })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get()
  @ApiOperation({ summary: "Returns all information about user except for password" })
  @UseGuards(JwtGuard)
  async getInfo(@Request() req) {
    const id = req["user"]["sub"];
    const user = await this.userService.getById(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
