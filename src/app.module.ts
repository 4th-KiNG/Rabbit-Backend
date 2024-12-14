import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "./user/user.entity";
import { ConfigModule } from "@nestjs/config";
import { PostsModule } from "./posts/posts.module";
import { Posts } from "./posts/posts.entity";
import { MinioModule } from "./minio/minio.module";
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
      entities: [User, Posts],
      synchronize: true,
      //autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    MinioModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
