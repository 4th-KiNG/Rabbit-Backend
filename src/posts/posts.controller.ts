import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  Response,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Request as Request_type, Response as Response_type } from "express";
import { JwtGuard } from "src/guard/jwt.guard";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  CreatePost(@Request() req: Request_type) {
    const id = req["userId"]["sub"];
    return this.postsService.createPost(
      id,
      req.body.title,
      req.body.text,
      req.body.likeId,
      req.body.commentsId,
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  GetPosts() {
    return this.postsService.getPosts();
  }
}
