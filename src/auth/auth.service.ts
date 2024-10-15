import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { UserService } from "src/user/user.service";
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signUp(dto: CreateUserDto) {
        const user = await this.userService.create(dto);
        const payload = { sub: user.id, username: user.username };
        return { access_token: await this.jwtService.signAsync(payload) };  
    }

}

