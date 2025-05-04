import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCommentDto } from "src/dtos/comment.dto";
import { Comment } from "./comments.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ParentType } from "./comments.types";
import { MailerService } from "@nestjs-modules/mailer";
import { join } from "path";
import { UserService } from "src/user/user.service";
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async createComment(id: string, dto: CreateCommentDto) {
    const postOwnerId = id;
    const postText = dto.text;
    const parentId = dto.parentId;
    const parentType = dto.parentType;
    const newComment = this.commentRepository.create({
      ownerId: postOwnerId,
      text: postText,
      creationDate: new Date(),
      parentId: parentId,
      parentType: parentType,
      likesId: [],
    });
    return await this.commentRepository.save(newComment);
  }

  async addLike(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOneBy({
      id: commentId,
    });
    if (!comment.likesId.includes(userId)) comment.likesId.push(userId);
    else comment.likesId = comment.likesId.filter((id) => id != userId);
    return this.commentRepository.save(comment);
  }

  async getLikes(commentId: string) {
    const comment = await this.commentRepository.findOneBy({
      id: commentId,
    });
    return comment?.likesId ?? [];
  }

  async deleteComment(
    commentId: string,
    parentType: ParentType,
    userId: string,
  ) {
    const toDelete = await this.commentRepository.findOneBy({
      id: commentId,
      parentType: parentType,
    });
    const isAdmin =
      (await this.userService.getById(userId)).username ===
      process.env.ADMIN_USERNAME;
    if (toDelete.ownerId != userId && !isAdmin)
      throw new HttpException(
        "Недостаточно прав для удаления",
        HttpStatus.BAD_REQUEST,
      );
    toDelete.likesId.splice(0, toDelete.likesId.length);
    const replies = await this.commentRepository.findBy({
      parentId: commentId,
      parentType: ParentType.Comment,
    });

    for (const e of replies) {
      await this.commentRepository.delete({
        id: e.id,
        parentType: e.parentType,
      });
    }

    return await this.commentRepository.delete({
      id: commentId,
      parentType: parentType,
    });
  }

  async getCommentTreeLevel(parentId: string, parentType: ParentType) {
    return await this.commentRepository.findBy({
      parentId: parentId,
      parentType: parentType,
    });
  }

  async sendReport(userId: string, commentId: string, reason: string) {
    const user = await this.userService.getById(userId);
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    await this.mailerService.sendMail({
      to: process.env.WORK_EMAIL,
      subject: "Жалоба на комментарий",
      template: join(__dirname, "/../templates", "reportComment"),
      context: {
        reason: reason,
        userUrl: `${process.env.CURRENT_HOST}/user/${user.id}`,
        commentId: `${comment.id}`,
        userEmail: user.email,
      },
    });
    return "ok";
  }

  async getCommentsByOwner(ownerId: string) {
    const comments = await this.commentRepository.findBy({ ownerId: ownerId });
    return comments;
  }
}
