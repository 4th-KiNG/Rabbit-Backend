import { Injectable } from '@nestjs/common';
import {CreatePostDto} from './posts.dto';
import { Repository } from "typeorm";
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
      ) {}
}