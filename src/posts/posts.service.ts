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
    if (images) {
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
    }

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
    let posts = await this.postsRepository.find();

    if (ownerId) {
      posts = await this.postsRepository.find({ where: { ownerId } });
    }

    if (search_string) {
      const words = parseSearchString(search_string);
      posts = posts.filter((post) => {
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

    return posts.sort((post1, post2) => {
      if (post1.createDate < post2.createDate) return 1;
      else return -1;
    });
  }

  async getLikes(postId: string) {
    const postLikes = (await this.postsRepository.findOneBy({ id: postId }))
      .likesId;
    return postLikes;
  }

  async getPost(postId: string) {
    return this.postsRepository.findOneBy({ id: postId });
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
    let likePost = await this.postsRepository.findOneBy({ id: postId });
    if (status == "like") {
      likePost.likesId.push(userId);
    } else {
      likePost = {
        ...likePost,
        likesId: likePost.likesId.filter((id) => id !== userId),
      };
    }
    return await this.postsRepository.save(likePost);
  }
}
