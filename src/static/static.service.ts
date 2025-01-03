import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { MinioService } from "src/minio/minio.service";

@Injectable()
export class StaticService {
  constructor(private readonly minioService: MinioService) {}

  async getImage(bucketname: string, name: string, res: Response) {
    const image = await this.minioService.getFileAsFileStream(bucketname, name);
    image.pipe(res);
  }
}
