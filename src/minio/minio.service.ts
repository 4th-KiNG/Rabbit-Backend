import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Client } from "minio";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private bucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>("MINIO_ENDPOINT"),
      port: parseInt(this.configService.get<string>("MINIO_PORT")),
      useSSL: parseInt(this.configService.get<string>("MINIO_USESSL")) === 1,
      accessKey: this.configService.get<string>("MINIO_ACCESSKEY"),
      secretKey: this.configService.get<string>("MINIO_SECRETKEY"),
    });
    //так как у нас картинки будут не только в качестве аватарок, а ещё в виде баннеров, картинок постов и тд,
    //то неправильно все сохранять в bucket с одним названием
    //если добавлять картинки, то лучше дополнительным аргументом указать bucketName, чтобы не складывать все в одну папку
    this.bucketName = this.configService.get<string>("MINIO_BUCKETNAME");
  }
  //лучше добавить в эту функцию аргумент bucketName и сразу в конструкторе создавать bucket с названием avatars,
  //чем в каждой функции заново проверять и создавать
  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(
        this.bucketName,
        this.configService.get<string>("MINIO_REGION"),
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    await this.createBucketIfNotExists();
    const fileName = file.originalname;
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  //может быть не увидел, где именно юзается данная функция?
  async getFileUrl(fileName: string) {
    await this.createBucketIfNotExists();
    return await this.minioClient.presignedUrl(
      "GET",
      this.bucketName,
      fileName,
    );
  }

  async getFileAsFileStream(fileName: string) {
    await this.createBucketIfNotExists();
    try {
      return await this.minioClient.getObject(this.bucketName, fileName);
    } catch (error) {
      throw new HttpException("Фотография не найдена", HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(fileName: string) {
    await this.createBucketIfNotExists();
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
