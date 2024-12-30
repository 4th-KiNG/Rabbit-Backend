import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";
import { JwtModule } from "@nestjs/jwt";
import { MinioModule } from "src/minio/minio.module";

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), JwtModule, MinioModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}
