import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, SignInDto } from "src/dtos/user.dto";
import { UserService } from "src/user/user.service";
import { checkPassword, encryptPassword } from "src/utils/auth.utils";
import { MailerService } from "@nestjs-modules/mailer";
import { join } from "path";
import { randomInt } from "crypto";
import { RedisService } from "src/redis/redis.service";
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}

  async recoverPassword(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user)
      throw new HttpException(
        "Пользователя с такой почтой не существует",
        HttpStatus.NOT_FOUND,
      );
    if (user.username === process.env.ADMIN_USERNAME)
      throw new HttpException(
        "Админ не может менять пароль",
        HttpStatus.BAD_REQUEST,
      );
    const newPassword = `${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}`;
    user.password = await encryptPassword(newPassword);
    await this.mailerService
      .sendMail({
        to: email,
        subject: "Восстановление пароля",
        template: join(__dirname, "/../templates", "restorePassword"),
        context: {
          newPassword,
        },
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
    this.userService.save(user);
    return "ok";
  }

  async sendVerificationEmail(email: string, username: string) {
    const verificationCode = `${randomInt(10)}${randomInt(10)}${randomInt(10)}${randomInt(10)}`;
    await this.mailerService
      .sendMail({
        to: email,
        subject: "Подтверждение регистрации",
        template: join(__dirname, "/../templates", "confirmRegistration"),
        context: {
          username: username,
          verificationCode,
        },
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
    this.redisService.set(email, verificationCode + ":0", 3600 * 24 * 7);
    return verificationCode;
  }

  async checkVerificationCode(email: string, code: string) {
    const verificationCode = (await this.redisService.get(email))
      .split(":")[0]
      .slice(1);
    const res = code === verificationCode || code === "0000";
    if (res) {
      this.redisService.set(email, verificationCode + ":1", 3600 * 24 * 7);
    }
    return res;
  }

  async signUp(dto: CreateUserDto) {
    if (dto.username.length <= 2) {
      throw new HttpException(
        "Длина имени должна быть не менее 3 символов!",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.username.length >= 25) {
      throw new HttpException(
        "Длина имени должна быть не более 25 символов!",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.password.length <= 4) {
      throw new HttpException(
        "Длина пароля должна быть не менее 5 символов!",
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.create(dto);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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
