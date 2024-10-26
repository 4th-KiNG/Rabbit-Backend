import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt); // callback -> promise

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
    //Могу ошибаться, но по моему если почта будет не уникальной,
    //то операция создания просто ошибку выдаст, так что хз нужна ли эта проверка
    if (await this.getByEmail(newUserEmail))
      throw new BadRequestException("Данная почта уже используется!");
    //Имя в нашем случае не является уникальным, так что можно эту проверку убрать
    if (await this.getByUsername(newUserUsername))
      throw new BadRequestException(
        "Пользователь с таким именем уже существует!",
      );
    //Шифрование тоже лучше вынести в папку utils в виде функции
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(newUserPassword, salt, 32)) as Buffer;

    const encryptedPassword = salt + "." + hash.toString("hex");
    //Тут await не нужен
    const newUser = await this.userRepository.create({
      username: newUserUsername,
      email: newUserEmail,
      password: encryptedPassword,
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
