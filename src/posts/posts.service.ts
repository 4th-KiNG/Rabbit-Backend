import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Posts } from "./posts.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}
}
