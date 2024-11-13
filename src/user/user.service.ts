import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "src/dtos/user.dto";
import { encryptPassword } from "src/utils/auth.utils";
import { Role } from "./user.types";
import { MinioService } from "src/minio/minio.service";
import { Response as Response_type } from "express";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    const newUserEmail = dto.email;
    const newUserUsername = dto.username;
    const newUserPassword = dto.password;
    if (await this.getByEmail(newUserEmail))
      throw new HttpException(
        "Пользователь с такой почтой уже существует!",
        HttpStatus.BAD_REQUEST,
      );

    if (await this.getByUsername(newUserUsername))
      throw new HttpException(
        "Пользователь с таким nickname уже существует!",
        HttpStatus.BAD_REQUEST,
      );

    const newUser = this.userRepository.create({
      username: newUserUsername,
      email: newUserEmail,
      password: await encryptPassword(newUserPassword),
      regDate: new Date(),
      role: Role.BasicUser,
    });
    return await this.userRepository.save(newUser);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.getById(id);
    if (dto.newBirthDate) user.birthDate = dto.newBirthDate;
    if (dto.newSex) user.sex = dto.newSex;
    if (dto.newUsername)
      if (!(await this.getByUsername(dto.newUsername)))
        user.username = dto.newUsername;
      else
        throw new HttpException(
          "Данный nickname уже занят",
          HttpStatus.BAD_REQUEST,
        );
    return await this.userRepository.save(user);
  }

  async changeAvatar(id: string, file: Express.Multer.File) {
    file.originalname = id + ".png";
    return await this.minioService.uploadFile(
      this.configService.get<string>("MINIO_AVATARS_BUCKETNAME"),
      file,
    );
  }

  async getAvatar(id: string, res: Response_type) {
    try {
      const fName = id + ".png";
      const fileStream = await this.minioService.getFileAsFileStream(
        this.configService.get<string>("MINIO_AVATARS_BUCKETNAME"),
        fName,
      );
      res.set({ "Content-Type": "image/png" });
      fileStream.pipe(res);
    } catch {
      this.getAvatar("default-avatar", res);
    }
  }

  async changeBanner(id: string, file: Express.Multer.File) {
    file.originalname = id + ".png";
    return await this.minioService.uploadFile(
      this.configService.get<string>("MINIO_BANNERS_BUCKETNAME"),
      file,
    );
  }

  async getBanner(id: string, res: Response_type) {
    try {
      const fName = id + ".png";
      const fileStream = await this.minioService.getFileAsFileStream(
        this.configService.get<string>("MINIO_BANNERS_BUCKETNAME"),
        fName,
      );
      res.set({ "Content-Type": "image/png" });
      fileStream.pipe(res);
    } catch {
      this.getBanner("default-banner", res);
    }
  }

  async getById(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      delete user.password;
      return user;
    } catch {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
  }

  async getByUsername(username: string) {
    try {
      return await this.userRepository.findOneBy({ username: username });
    } catch {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
  }

  async getByUsernameUserController(username: string) {
    try {
      const user = await this.getByUsername(username);
      delete user.email;
      return user;
    } catch {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.userRepository.findOneBy({ email: email });
    } catch {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
  }
}
