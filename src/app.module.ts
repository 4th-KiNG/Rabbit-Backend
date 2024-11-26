import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "./user/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioModule } from "./minio/minio.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { getMailConfig } from "./configs/getMailConfig";
import { RedisModule } from "./redis/redis.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.DATABASE,
      entities: [User],
      synchronize: true,
      // autoLoadEntities: true
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
    AuthModule,
    UserModule,
    MinioModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
