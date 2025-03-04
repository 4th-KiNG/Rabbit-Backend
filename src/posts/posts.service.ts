import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";
import { MinioService } from "src/minio/minio.service";
import { getMimeType, hashNameGenerate } from "src/utils/static.utils";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly minioService: MinioService,
    private readonly prepositionsAndConjunctions: string[] = [
      "а",
      "без",
      "в",
      "для",
      "до",
      "за",
      "из",
      "к",
      "на",
      "над",
      "о",
      "об",
      "от",
      "по",
      "под",
      "при",
      "про",
      "с",
      "у",
      "через",
    ],
  ) {}

  async createPost(
    id: string,
    title: string,
    text: string,
    images: Express.Multer.File[],
  ) {
    const postImages = [];
    await Promise.all(
      images.map(async (image) => {
        if (
          image.mimetype !== "image/png" &&
          image.mimetype !== "image/jpg" &&
          image.mimetype !== "image/jpeg"
        ) {
          throw new HttpException(
            "Неверный формат изображения",
            HttpStatus.BAD_REQUEST,
          );
        }
        const fileName =
          (await hashNameGenerate(image.originalname)) +
          getMimeType(image.mimetype);
        image.originalname = fileName;
        postImages.push(fileName);
        await this.minioService.uploadFile(
          process.env.MINIO_POSTSIMAGES_BUCKETNAME,
          image,
        );
      }),
    );
    const newPost = this.postsRepository.create({
      ownerId: id,
      title: title,
      commentsId: [],
      likesId: [],
      text: text,
      createDate: new Date(),
      images: postImages,
      tags: [],
    });
    return await this.postsRepository.save(newPost);
  }

  parseSearchString(search_string: string): string[] {
    const regexPrepositions = new RegExp(
      `\\b(${this.prepositionsAndConjunctions.join("|")})\\b`,
      "gi",
    );

    let cleanedString = search_string.replace(regexPrepositions, "");

    return cleanedString.split(/[.,/#!$%^&*;:{}=-_`~()]+/).filter(Boolean);
  }

  async getPosts(ownerId?: string, search_string?: string) {
    if (!ownerId || !search_string) {
      return await this.postsRepository.find();
    }

    const words = this.parseSearchString(search_string);

    const posts = await this.postsRepository.find({ where: { ownerId } });

    return posts.filter((post) => {
      const postTags = post.tags;
      let hasMatchingTag = false;

      words.forEach((word) => {
        if (postTags.includes(word)) {
          hasMatchingTag = true;
        }
      });
      return hasMatchingTag;
    });
  }

  async deletePost(userId: string, postId: string) {
    const delPost = await this.postsRepository.findOneBy({ id: postId });
    if (delPost.ownerId === userId) {
      await this.postsRepository.delete(delPost.id);
      return "ok";
    } else
      throw new HttpException(
        "Невозможно удалить пост",
        HttpStatus.BAD_REQUEST,
      );
  }

  async likePost(userId: string, postId: string) {
    const likePost = await this.postsRepository.findOneBy({ id: postId });
    likePost.likesId.push(userId);
    return await this.postsRepository.save(likePost);
  }

  async dislikePost(userId: string, postId: string) {
    const dislikePost = await this.postsRepository.findOneBy({ id: postId });
    dislikePost.likesId = dislikePost.likesId.filter((id) => id !== userId);
    return await this.postsRepository.save(dislikePost);
  }
}

