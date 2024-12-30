import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export const hashNameGenerate = async (name: string) => {
  const salt = randomBytes(8).toString("hex");
  const hash = (await scrypt(name, salt, 32)) as Buffer;
  return salt + "." + hash.toString("hex");
};

export const getMimeType = (mimeType: string): string => {
  return "." + mimeType.split("/")[1];
};
