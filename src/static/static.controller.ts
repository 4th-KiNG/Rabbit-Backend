import { Controller, Get, Header, Param, Res } from "@nestjs/common";
import { StaticService } from "./static.service";
import { Response } from "express";

@Controller("static")
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Header("Content-Type", "image/png")
  @Get(":busketname/:name")
  GetImage(
    @Param("busketname") busketname: string,
    @Param("name") name: string,
    @Res() res: Response,
  ) {
    return this.staticService.getImage(busketname, name, res);
  }
}
