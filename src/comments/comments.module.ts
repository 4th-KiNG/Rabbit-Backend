import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./comments.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
@Module({
  imports: [TypeOrmModule.forFeature([Comment]), JwtModule, UserModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}
