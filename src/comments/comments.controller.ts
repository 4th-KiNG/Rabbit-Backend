import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
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

  @ApiOperation({ summary: "create comment" })
  @Post("create")
  @UseGuards(JwtGuard)
  Create(@Body() dto: CreateCommentDto, @Request() req: Request_type) {
    const id = req["user"]["sub"];
    return this.commentsService.createComment(id, dto);
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
}
