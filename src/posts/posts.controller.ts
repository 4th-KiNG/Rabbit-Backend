//неиспользуемые import`ы нужно удалить
import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { PostsService } from "./posts.service";
//неиспользуемый import нужно удалить
import { CreatePostDto } from "./posts.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
}
