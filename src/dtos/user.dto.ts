import { IsString, IsEmail, IsOptional, IsDate, IsEnum } from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Sex } from "src/user/user.types";
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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "Jose", description: "User's new name" })
  newUsername: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: "2024-01-01",
    description: "User's new birth date",
  })
  newBirthDate: Date;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      if (value.toLowerCase() === "муж") return Sex.Male;
      else if (value.toLowerCase() === "жен") return Sex.Female;
    }
    return undefined;
  })
  @ApiProperty({
    example: "муж",
    description: "User's new sex",
  })
  @IsEnum(Sex)
  newSex: Sex;
}

export class CheckVerificationDto {
  @IsEmail()
  @ApiProperty({ example: "123@ya.ru", description: "User's email" })
  email: string;

  @IsString()
  @ApiProperty({ example: "1111", description: "Verification code" })
  code: string;
}
