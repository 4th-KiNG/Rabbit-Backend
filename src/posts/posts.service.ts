import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  async createPost(
    id: string,
    title: string,
    text: string,
    commentsId: null,
    likeId: null,
  ) {
    const newPost = this.postsRepository.create({
      id: id,
      title: title,
      commentsId: commentsId,
      likeId: likeId,
      text: text,
      createDate: new Date(),
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return this.postsRepository.find();
  }
}
