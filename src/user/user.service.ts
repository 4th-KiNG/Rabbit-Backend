import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/dtos/user.dto";
import { encryptPassword } from "src/utils/auth.utils";
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
    });
    return await this.userRepository.save(newUser);
  }

  // id должен иметь вид uuid!!!
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
