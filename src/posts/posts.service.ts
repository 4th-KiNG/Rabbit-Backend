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

  async createPost(id: string, title: string, text: string) {
    const newPost = {
      id: id,
      title: title,
      text: text,
      createDate: new Date(),
    };
    return this.postsRepository.save(newPost);
  }

  async getPost(id: string) {
    return this.postsRepository.find();
  }
}

