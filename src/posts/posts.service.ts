import { Injectable } from "@nestjs/common";
//неиспользуемый import нужно удалить
import { CreatePostDto } from "./posts.dto";
import { Repository } from "typeorm";
import { Posts } from "./posts.entity";

@Injectable()
export class PostsService {
  constructor(
    //обрати внимание, не импортировала InjectRepository, код не скопилируется
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}
}
