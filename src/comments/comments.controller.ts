import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "src/dtos/comment.dto";
import { Request as Request_type } from "express";
import { JwtGuard } from "src/guard/jwt.guard";
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
  @Get("get")
  GetCommentTreeLevel(@Body() dto: Omit<CreateCommentDto, "text">) {
    return this.commentsService.getCommentTreeLevel(
      dto.parentId,
      dto.parentType,
    );
  }
}
