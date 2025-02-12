import { Module } from "@nestjs/common";
import { StaticService } from "./static.service";
import { StaticController } from "./static.controller";
import { MinioModule } from "src/minio/minio.module";

@Module({
  imports: [MinioModule],
  controllers: [StaticController],
  providers: [StaticService],
})
export class StaticModule {}
