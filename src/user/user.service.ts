import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "src/dtos/user.dto";
import { encryptPassword } from "src/utils/auth.utils";
import { Role } from "./user.types";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
        "Пользователь с таким username уже существует!",
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

  async getById(id: string) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async getByUsername(username: string) {
    return await this.userRepository.findOneBy({ username: username });
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }
}
