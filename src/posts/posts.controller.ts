import {
  Controller,
  Post,
  Param,
  Get,
  UseGuards,
  Request,
  Delete,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Request as Request_type } from "express";
import { JwtGuard } from "src/guard/jwt.guard";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  CreatePost(@Request() req: Request_type) {
    const id = req["user"]["sub"];
    return this.postsService.createPost(id, req.body.title, req.body.text);
  }

  @Get()
  @UseGuards(JwtGuard)
  GetPosts() {
    return this.postsService.getPosts();
  }

  @Delete(":postId")
  @UseGuards(JwtGuard)
  DeletePost(@Request() req: Request_type, @Param("postId") postId: string) {
    const id = req["user"]["sub"];
    return this.postsService.deletePost(id, postId);
  }
}
