import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "./posts.entity";
import { MinioService } from "src/minio/minio.service";
import { getMimeType, hashNameGenerate } from "src/utils/static.utils";
import { parseSearchString } from "src/utils/posts.utils";
import { UserService } from "src/user/user.service";
import { MailerService } from "@nestjs-modules/mailer";
import { join } from "path";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly minioService: MinioService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
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

  async getPosts(
    userId: string,
    ownerId?: string,
    search_string?: string,
    page?: number,
  ) {
    const query = this.postsRepository.createQueryBuilder("post");
    const user = await this.userService.getById(userId);

    if (user.subscriptionsId && user.subscriptionsId.length > 0) {
      query.addOrderBy(
        `CASE WHEN post.ownerId IN (${user.subscriptionsId
          .map((sub) => `'${sub}'`)
          .join(",")}) THEN 0 ELSE 1 END`,
        "ASC",
      );
    }

    query.addOrderBy("post.createDate", "DESC");

    if (ownerId) query.where("post.ownerId = :ownerId", { ownerId });

    if (search_string) {
      const words = parseSearchString(search_string);
      if (words.length > 0) {
        const searchConditions = words
          .map((word) => {
            return `(
            LOWER(post.tags) LIKE '%${word.toLowerCase()}%' OR 
            LOWER(post.title) LIKE '%${word.toLowerCase()}%' OR 
            LOWER(post.text) LIKE '%${word.toLowerCase()}%'
          )`;
          })
          .join(" OR ");

        query.andWhere(`(${searchConditions})`);
      }
    }

    const total = await query.getCount();

    if (page !== undefined) {
      query.skip((page - 1) * 10).take(10);
    }

    const posts = await query.getMany();

    return {
      posts,
      total,
    };
  }

  async getLikes(postId: string) {
    const postLikes =
      (await this.postsRepository.findOneBy({ id: postId }))?.likesId ?? [];
    return postLikes;
  }

  async getPost(postId: string) {
    return this.postsRepository.findOneBy({ id: postId });
  }

  async deletePost(userId: string, postId: string) {
    const delPost = await this.postsRepository.findOneBy({ id: postId });
    const isAdmin =
      (await this.userService.getById(userId)).username ===
      process.env.ADMIN_USERNAME;
    if (delPost.ownerId === userId || isAdmin) {
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
    if (!likePost.likesId.includes(userId)) likePost.likesId.push(userId);
    else likePost.likesId = likePost.likesId.filter((id) => id != userId);
    return await this.postsRepository.save(likePost);
  }

  async sendReport(userId: string, postId: string, reason: string) {
    const user = await this.userService.getById(userId);
    const post = await this.postsRepository.findOneBy({ id: postId });
    await this.mailerService.sendMail({
      to: process.env.WORK_EMAIL,
      subject: "Жалоба на пост",
      template: join(__dirname, "/../templates", "reportPost"),
      context: {
        reason: reason,
        userUrl: `${process.env.CURRENT_HOST}/user/${user.id}`,
        postUrl: `${process.env.CURRENT_HOST}/post/${post.id}`,
        userEmail: user.email,
      },
    });
    return "ok";
  }
}
