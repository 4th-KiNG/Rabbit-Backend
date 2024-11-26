import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CheckVerificationDto,
  CreateUserDto,
  SignInDto,
} from "src/dtos/user.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("verification")
  @ApiOperation({ summary: "Send verification email" })
  SendVerificationEmail(@Body() dto: Omit<CreateUserDto, "password">) {
    this.authService.sendVerificationEmail(dto.email, dto.username);
  }

  @Post("verification/check")
  @ApiOperation({ summary: "Check verification" })
  CheckVerification(@Body() dto: CheckVerificationDto) {
    return this.authService.checkVerificationCode(dto.email, dto.code);
  }

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
