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

  //При создании поста я тебе поправить, чтобы свойствам likesId и commentsId присваивались просто пустые массивы при создании объекта
  //Создавать лучше через функцию create (образец напоминаю находится в ветке main)
  async createPost(id: string, title: string, text: string) {
    const newPost = {
      id: id,
      title: title,
      text: text,
      createDate: new Date(),
    };
    return this.postsRepository.save(newPost);
  }

  //Даже по логике, если id передается в getPost, его же нужно где то использовать, а у тебя оно не используется)
  //Короче говоря id нужно убрать
  //Для получения всех постов из бд, у репозитория немного другая функция. Я тебе в задаче по моему её даже написал, посмотри ещё раз
  async getPost(id: string) {
    return this.postsRepository.find();
  }
}
