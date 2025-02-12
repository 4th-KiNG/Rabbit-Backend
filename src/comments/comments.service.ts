import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCommentDto } from "src/dtos/comment.dto";
import { Comment } from "./comments.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(id: string, dto: CreateCommentDto) {
    const postOwnerId = id;
    const postText = dto.text;
    const parentId = dto.parentId ? dto.parentId : "0";
    const newPost = this.commentRepository.create({
      ownerId: postOwnerId,
      text: postText,
      creationDate: new Date(),
      parentId: parentId,
    });

    await this.commentRepository.save(newPost);
    if (dto.parentId) {
      const parentComment = await this.getCommentById(dto.parentId);
      if (!parentComment.commentsId) parentComment.commentsId = [];
      parentComment.commentsId.push(newPost.id);
      for (let i = 0; i < parentComment.commentsId.length; i++) {
        const c = parentComment.commentsId.at(i);
        console.log(c);
      }

      await this.commentRepository.save(parentComment);
    }
    return newPost;
  }

  async getCommentById(id: string) {
    try {
      return await this.commentRepository.findOneBy({ id: id });
    } catch {
      throw new HttpException("Комментарий не найден", HttpStatus.NOT_FOUND);
    }
  }
}
