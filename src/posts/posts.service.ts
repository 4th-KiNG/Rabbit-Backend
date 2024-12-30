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
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return this.postsRepository.find();
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
}
