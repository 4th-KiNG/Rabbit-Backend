import { IsString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ParentType } from "src/comments/comments.types";
import { Transform } from "class-transformer";
export class CreateCommentDto {
  @ApiProperty({ example: "text", description: "comment text" })
  @IsString()
  text: string;

  @ApiProperty({ example: "zxcvbn", description: "parent comment's id" })
  @IsString()
  parentId: string;

  @Transform(({ value }) => {
    if (typeof value === "string") {
      if (value.toLowerCase() === "post") return ParentType.Post;
      else if (value.toLowerCase() === "comment") return ParentType.Comment;
    }
    return undefined;
  })
  @ApiProperty({
    example: "comment",
    description: "comment parent's type (comment/post)",
  })
  @IsEnum(ParentType)
  parentType: ParentType;
}
