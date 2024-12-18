import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  async createPost(id: string, title: string, text: string) {
    const newPost = this.postsRepository.create({
      userId: id,
      title: title,
      commentsId: [],
      likesId: [],
      text: text,
      createDate: new Date(),
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return this.postsRepository.find();
  }

  async deletePost(userId: string, postId: string) {
    const delPost = this.postsRepository.findOneBy({ id: postId });
    if (delPost.userId === userId) await this.postsRepository.delete(delPost);
    else
      throw new HttpException(
        "Невозможно удалить пост",
        HttpStatus.BAD_REQUEST,
      );
  }
}

