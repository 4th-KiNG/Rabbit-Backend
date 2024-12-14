import { randomBytes, scrypt as _scrypt } from "crypto";
import { SignInDto } from "src/dtos/user.dto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export async function checkPassword(dto: SignInDto, password: string) {
  const [salt, storedHash] = password.split(".");
  const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
  return storedHash === hash.toString("hex");
}

export async function encryptPassword(password: string) {
  const salt = randomBytes(8).toString("hex");
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return salt + "." + hash.toString("hex");
}
