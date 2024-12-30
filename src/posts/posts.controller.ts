import {
  Controller,
  Post,
  Param,
  Get,
  UseGuards,
  Request,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Request as Request_type } from "express";
import { JwtGuard } from "src/guard/jwt.guard";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(AnyFilesInterceptor())
  CreatePost(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req: Request_type,
  ) {
    const id = req["user"]["sub"];
    const { title, text } = req.body;
    return this.postsService.createPost(id, title, text, images);
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
