import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dtos/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

}

