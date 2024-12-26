import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ example: "text", description: "comment text" })
  @IsString()
  text: string;
}
