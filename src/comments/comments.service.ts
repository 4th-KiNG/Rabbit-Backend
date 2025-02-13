import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCommentDto } from "src/dtos/comment.dto";
import { Comment } from "./comments.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ParentType } from "./comments.types";
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(id: string, dto: CreateCommentDto) {
    const postOwnerId = id;
    const postText = dto.text;
    const parentId = dto.parentId;
    const parentType = dto.parentType;
    const newComment = await this.commentRepository.create({
      ownerId: postOwnerId,
      text: postText,
      creationDate: new Date(),
      parentId: parentId,
      parentType: parentType,
      likesId: [],
    });
    return await this.commentRepository.save(newComment);
  }

  async getCommentTreeLevel(parentId: string, parentType: ParentType) {
    return await this.commentRepository.findBy({
      parentId: parentId,
      parentType: parentType,
    });
  }

  async getCommentById(id: string) {
    try {
      return await this.commentRepository.findOneBy({ id: id });
    } catch {
      throw new HttpException("Комментарий не найден", HttpStatus.NOT_FOUND);
    }
  }
}
