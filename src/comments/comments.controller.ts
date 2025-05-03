import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
  Delete,
  Patch,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "src/dtos/comment.dto";
import { Request as Request_type } from "express";
import { JwtGuard } from "src/guard/jwt.guard";
import { ParentType } from "./comments.types";

@ApiTags("comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "like or unlike post" })
  @Patch("like")
  @UseGuards(JwtGuard)
  Like(
    @Request() req: Request_type,
    @Body() data: { commentId: string; parentType: string },
  ) {
    const commentId = data.commentId;
    const parentType = data.parentType;
    const id = req["user"]["sub"];
    return this.commentsService.addLike(
      commentId,
      parentType.toLowerCase() == "comment"
        ? ParentType.Comment
        : ParentType.Post,
      id,
    );
  }

  @ApiOperation({ summary: "like or unlike post" })
  @Get("likes")
  @UseGuards(JwtGuard)
  GetLikes(
    @Query("commentId") commentId: string,
    @Query("parentType") parentType: string,
  ) {
    return this.commentsService.getLikes(
      commentId,
      parentType.toLowerCase() == "comment"
        ? ParentType.Comment
        : ParentType.Post,
    );
  }

  @ApiOperation({ summary: "create comment" })
  @Post("create")
  @UseGuards(JwtGuard)
  Create(@Body() dto: CreateCommentDto, @Request() req: Request_type) {
    const id = req["user"]["sub"];
    return this.commentsService.createComment(id, dto);
  }

  @ApiOperation({ summary: "delete comment" })
  @Delete()
  @UseGuards(JwtGuard)
  Delete(
    @Query("commentId") commentId: string,
    @Query("parentType") parentType: string,
    @Request() req: Request_type,
  ) {
    const userId = req["user"]["sub"];
    return this.commentsService.deleteComment(
      commentId,
      parentType.toLowerCase() == "comment"
        ? ParentType.Comment
        : ParentType.Post,
      userId,
    );
  }

  @ApiOperation({ summary: "get comment tree's level" })
  @Get()
  GetCommentTreeLevel(
    @Query("parentId") parentId: string,
    @Query("parentType") parentType: string,
  ) {
    return this.commentsService.getCommentTreeLevel(
      parentId,
      parentType.toLowerCase() == "comment"
        ? ParentType.Comment
        : ParentType.Post,
    );
  }

  @Post(":commentId/report")
  @ApiOperation({ summary: "report to comment" })
  @UseGuards(JwtGuard)
  SendReport(
    @Request() req: Request_type,
    @Body() data: { reason: string },
    @Param("commentId") commentId: string,
  ) {
    const id = req["user"]["sub"];
    return this.commentsService.sendReport(id, commentId, data.reason);
  }

  @Get(":ownerId")
  @ApiOperation({ summary: "get by owner id" })
  @UseGuards(JwtGuard)
  GetByOwnerId(@Param("ownerId") ownerId: string) {
    return this.commentsService.getCommentsByOwner(ownerId);
  }
}
