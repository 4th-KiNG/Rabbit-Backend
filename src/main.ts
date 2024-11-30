import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as fs from "fs";
import * as path from "path";

async function bootstrap() {
  const ssl = process.env.SSL === "TRUE";
  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || "";
    const certPath = process.env.SSL_CERT_PATH || "";
    try {
      httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, keyPath)),
        cert: fs.readFileSync(path.join(__dirname, certPath)),
      };
    } catch {
      console.log(path.join(__dirname, keyPath));
      console.log(path.join(__dirname, certPath));
    }
  }
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Rabbit documentation")
    .setDescription("This is Rabbit's documentation")
    .setVersion("0.0.1")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);
  app.setGlobalPrefix("api");
  await app.listen(3000);
}
bootstrap();
