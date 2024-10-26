import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { SignInDto } from "src/dtos/signin.dto";
import { UserService } from "src/user/user.service";
import { scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

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
    if (!user) throw new BadRequestException("Неверные данные для входа");
    //Дешифрование пароля лучше вынести отдельно в папку utils в виде функции
    const [salt, storedHash] = user.password.split(".");
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    if (storedHash != hash.toString("hex"))
      throw new BadRequestException("Неверные данные для входа");

    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
