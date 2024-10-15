import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: "secret",
      signOptions: { expiresIn: "1h" }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
