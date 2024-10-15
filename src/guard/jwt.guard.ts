import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpStatus
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const [type, token] = request.headers.authorization?.split(" ") ?? ["failed", null];
        if (type !== "Bearer" || !token)
            throw new UnauthorizedException("Ошибка при авторизации пользователя");

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: "secret" });
            request['user'] = payload;
        }
        catch {
            throw new UnauthorizedException("Ошибка при авторизации пользователя");
        }

        return true;
    }

}