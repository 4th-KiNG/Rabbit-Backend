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
import { CommentsModule } from "./comments/comments.module";
import { Comment } from "./comments/comments.entity";

import { ConfigModule } from "@nestjs/config";
import { PostsModule } from "./posts/posts.module";
import { Posts } from "./posts/posts.entity";
import { MinioModule } from "./minio/minio.module";
import { StaticModule } from "./static/static.module";
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
      entities: [User, Comment,Posts],
      synchronize: true,
      //autoLoadEntities: true,
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
    CommentsModule,
    PostsModule,
    StaticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
