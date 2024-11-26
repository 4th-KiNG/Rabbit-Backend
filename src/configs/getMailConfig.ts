import { MailerOptions } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { normalize } from "path";
console.log(normalize(join(__dirname, "..", "templates")));
export const getMailConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    host: configService.get<string>("SMTP_HOST"),
    port: Number(configService.get<string>("SMTP_PORT")),
    secure: true,
    auth: {
      user: configService.get<string>("SMTP_USER"),
      pass: configService.get<string>("SMTP_PASSWORD"),
    },
  },
  defaults: {
    from: `"Rabbit" <Rabbit-Ra88it@yandex.ru>`,
  },
  template: {
    adapter: new EjsAdapter(),
    options: {
      strict: true,
    },
  },
});
