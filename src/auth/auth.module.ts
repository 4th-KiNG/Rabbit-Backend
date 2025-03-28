import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "src/redis/redis.module";
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: "10h" },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
