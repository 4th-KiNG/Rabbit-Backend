import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";
import { MinioService } from "src/minio/minio.service";
import { getMimeType, hashNameGenerate } from "src/utils/static.utils";
import { parseSearchString } from "src/utils/posts.utils";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly minioService: MinioService,
  ) {}

  async createPost(
    id: string,
    title: string,
    text: string,
    images: Express.Multer.File[],
    tags: string[],
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
      tags: tags ?? [],
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts(ownerId?: string, search_string?: string) {
    if (!ownerId || !search_string) {
      return await this.postsRepository.find();
    }

    const words = parseSearchString(search_string);

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

  async likePost(userId: string, status: "like" | "dislike", postId: string) {
    const likePost = await this.postsRepository.findOneBy({ id: postId });
    if (status == "like") {
      likePost.likesId.push(userId);
    } else likePost.likesId.filter((id) => id !== userId);
    return await this.postsRepository.save(likePost);
  }
}

