import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, SignInDto } from "src/dtos/user.dto";
import { UserService } from "src/user/user.service";
import { checkPassword } from "src/utils/auth.utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user)
      throw new HttpException(
        "Такого пользователя не существует",
        HttpStatus.NOT_FOUND,
      );

    if (!(await checkPassword(dto, user.password)))
      throw new HttpException(
        "Неверные данные для входа",
        HttpStatus.BAD_REQUEST,
      );

    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
