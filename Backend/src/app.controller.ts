import { Body, Controller, Get, Header, HttpCode, HttpStatus, Post, Redirect, Req, Res } from '@nestjs/common';
import {Response} from "express"
import { AppService } from './app.service';

@Controller('calculator')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Header("abebe","bekele")
  @HttpCode(300)
  @Get("second")
  first(@Res({ passthrough: true })res:Response){
    // res.status(HttpStatus.OK);
    return "jk";

}
}
