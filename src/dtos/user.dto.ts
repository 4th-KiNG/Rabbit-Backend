import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: "Jose", description: "User's name" })
  username: string;

  @IsEmail()
  @ApiProperty({ example: "123@ya.ru", description: "User's email" })
  email: string;

  @IsString()
  @ApiProperty({ example: "123", description: "User's password" })
  password: string;
}

export class SignInDto {
  @IsEmail()
  @ApiProperty({ example: "123@ya.ru", description: "User's email" })
  email: string;

  @IsString()
  @ApiProperty({ example: "123", description: "User's password" })
  password: string;
}
