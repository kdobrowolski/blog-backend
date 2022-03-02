import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sendEmail')
  sendEmail(@Body() body: any): any {
    return this.appService.sendEmail(body);
  }
}
