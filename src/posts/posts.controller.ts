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
  Req,
  Query,
  Patch,
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
    const { title, text, tags } = req.body;
    return this.postsService.createPost(id, title, text, images, tags);
  }

  @Get()
  @UseGuards(JwtGuard)
  GetPosts(
    @Query("ownerId") ownerId: string,
    @Query("search_string") search_string: string,
  ) {
    return this.postsService.getPosts(ownerId, search_string);
  }

  @Get(":postId")
  @UseGuards(JwtGuard)
  GetPost(@Param("postId") postId: string) {
    return this.postsService.getPost(postId);
  }

  @Delete(":postId")
  @UseGuards(JwtGuard)
  DeletePost(@Request() req: Request_type, @Param("postId") postId: string) {
    const id = req["user"]["sub"];
    return this.postsService.deletePost(id, postId);
  }

  @Get(":postId/likes")
  @UseGuards(JwtGuard)
  GetLikes(@Param("postId") postId: string) {
    return this.postsService.getLikes(postId);
  }

  @Patch(":postId/likes")
  @UseGuards(JwtGuard)
  LikePost(
    @Request() req: Request_type,
    @Query("status") status: "like" | "dislike",
    @Param("postId") postId: string,
  ) {
    const id = req["user"]["sub"];
    return this.postsService.likePost(id, status, postId);
  }
}
