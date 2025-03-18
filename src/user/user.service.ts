import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "src/dtos/user.dto";
import { encryptPassword } from "src/utils/auth.utils";
import { Role } from "./user.types";
import { MinioService } from "src/minio/minio.service";
import { ConfigService } from "@nestjs/config";

import { getMimeType, hashNameGenerate } from "src/utils/static.utils";
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
      subscribersId: [],
      subscriptionsId: [],
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
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    )
      throw new HttpException(
        "Неверный формат изображения",
        HttpStatus.BAD_REQUEST,
      );
    const fileName =
      (await hashNameGenerate(file.originalname)) + getMimeType(file.mimetype);
    file.originalname = fileName;
    const user = await this.userRepository.findOneBy({ id: id });
    user.avatar = fileName;
    await this.userRepository.save(user);
    return await this.minioService.uploadFile(
      process.env.MINIO_AVATARS_BUCKETNAME,
      file,
    );
  }

  async changeBanner(id: string, file: Express.Multer.File) {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    )
      throw new HttpException(
        "Неверный формат изображения",
        HttpStatus.BAD_REQUEST,
      );
    const fileName =
      (await hashNameGenerate(file.originalname)) + getMimeType(file.mimetype);
    file.originalname = fileName;
    const user = await this.userRepository.findOneBy({ id: id });
    user.banner = fileName;
    await this.userRepository.save(user);
    return await this.minioService.uploadFile(
      process.env.MINIO_BANNERS_BUCKETNAME,
      file,
    );
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

  async getByUserId(userId: string) {
    try {
      const user = await this.getById(userId);
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

  async subscribeUser(
    userId: string,
    subsId: string,
    status: "subscribe" | "unsubscribe",
  ) {
    let user = await this.userRepository.findOneBy({ id: userId });
    let subsUser = await this.userRepository.findOneBy({ id: subsId });
    if (userId !== subsId) {
      if (
        status === "subscribe" &&
        !user.subscribersId.includes(subsId) &&
        !subsUser.subscriptionsId.includes(userId)
      ) {
        user.subscribersId.push(subsId);
        subsUser.subscriptionsId.push(userId);
      } else {
        user = {
          ...user,
          subscribersId: user.subscribersId.filter((sub) => sub !== subsId),
        };
        subsUser = {
          ...subsUser,
          subscriptionsId: subsUser.subscriptionsId.filter(
            (sub) => sub !== userId,
          ),
        };
      }
      this.userRepository.save(user);
      this.userRepository.save(subsUser);
    }
    return "OK";
  }
}
