import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, SignInDto } from "src/dtos/user.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({ summary: "Sign Up" })
  SignUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post("signin")
  @ApiOperation({ summary: "Sign In" })
  SignIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
