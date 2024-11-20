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
    return this.postsService.createPost(id, req.body.title, req.body.text);
  }
  //Тебе пока что нужно сделать получение всех постов, так что параметр id в сервисе лишний,
  //тем более что он у тебя и так не сработал бы, так как он в роуте не прописан. Параметр res тоже лишний, он тут не нужен
  //Функцию лучше назвать GetPosts, так как это получение всех постов. Аналогично в сервисе тоже getPosts
  @Get()
  @UseGuards(JwtGuard)
  GetPost(@Param("id") id: string, @Response() res: Response_type) {
    return this.postsService.getPost(id);
  }
}
