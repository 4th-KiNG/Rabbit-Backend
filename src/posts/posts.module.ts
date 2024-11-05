import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { Posts } from "./posts.entity";

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
