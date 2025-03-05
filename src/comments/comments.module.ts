import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./comments.entity";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [TypeOrmModule.forFeature([Comment]), JwtModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}
