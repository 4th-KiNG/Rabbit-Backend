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
  Body,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Request as Request_type } from "express";
import { JwtGuard } from "src/guard/jwt.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({
    summary: "Create post",
  })
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
  @ApiOperation({
    summary: "Getting all posts with(without) tags ",
  })
  @UseGuards(JwtGuard)
  GetPosts(
    @Query("ownerId") ownerId: string,
    @Query("search_string") search_string: string,
    @Query("page") page?: number,
  ) {
    return this.postsService.getPosts(ownerId, search_string, page);
  }

  @Get(":postId")
  @ApiOperation({
    summary: "Getting post by id ",
  })
  @UseGuards(JwtGuard)
  GetPost(@Param("postId") postId: string) {
    return this.postsService.getPost(postId);
  }

  @Delete(":postId")
  @ApiOperation({
    summary: "Delete post",
  })
  @UseGuards(JwtGuard)
  DeletePost(@Request() req: Request_type, @Param("postId") postId: string) {
    const id = req["user"]["sub"];
    return this.postsService.deletePost(id, postId);
  }

  @Get(":postId/likes")
  @ApiOperation({
    summary: "Getting liked posts",
  })
  @UseGuards(JwtGuard)
  GetLikes(@Param("postId") postId: string) {
    return this.postsService.getLikes(postId);
  }

  @Patch(":postId/likes")
  @ApiOperation({
    summary: "Dis/Liking posts",
  })
  @UseGuards(JwtGuard)
  LikePost(@Request() req: Request_type, @Param("postId") postId: string) {
    const id = req["user"]["sub"];
    return this.postsService.likePost(id, postId);
  }

  @Post(":postId/report")
  @ApiOperation({
    summary: "Report to post",
  })
  @UseGuards(JwtGuard)
  ReportPost(
    @Request() req: Request_type,
    @Body() data: { reason: string },
    @Param("postId") postId: string,
  ) {
    const id = req["user"]["sub"];
    return this.postsService.sendReport(id, postId, data.reason);
  }
}
