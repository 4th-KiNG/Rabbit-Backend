import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { SignInDto } from "src/dtos/signin.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
