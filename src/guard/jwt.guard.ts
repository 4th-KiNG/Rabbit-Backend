import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(" ") ?? [
      "failed",
      null,
    ];
    if (type !== "Bearer" || !token)
      throw new HttpException(
        "Ошибка при авторизации пользователя",
        HttpStatus.BAD_REQUEST,
      );

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("JWTSECRET"),
      });
      request["user"] = payload;
    } catch {
      throw new HttpException(
        "Ошибка при авторизации пользователя",
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
