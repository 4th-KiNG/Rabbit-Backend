import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Client } from "minio";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private avatarsBucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>("MINIO_ENDPOINT"),
      port: parseInt(this.configService.get<string>("MINIO_PORT")),
      useSSL: parseInt(this.configService.get<string>("MINIO_USESSL")) === 1,
      accessKey: this.configService.get<string>("MINIO_ACCESSKEY"),
      secretKey: this.configService.get<string>("MINIO_SECRETKEY"),
    });

    this.avatarsBucketName = this.configService.get<string>(
      "MINIO_AVATARS_BUCKETNAME",
    );
    this.createBucketIfNotExists(this.avatarsBucketName);
  }

  async createBucketIfNotExists(name: string) {
    const bucketExists = await this.minioClient.bucketExists(name);
    if (!bucketExists) {
      await this.minioClient.makeBucket(
        name,
        this.configService.get<string>("MINIO_REGION"),
      );
    }
  }

  async uploadFile(bucketName: string, file: Express.Multer.File) {
    const fileName = file.originalname;
    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFileAsFileStream(bucketName: string, fileName: string) {
    try {
      return await this.minioClient.getObject(bucketName, fileName);
    } catch (error) {
      throw new HttpException("Фотография не найдена", HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(bucketName: string, fileName: string) {
    await this.minioClient.removeObject(bucketName, fileName);
  }
}
