import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import config from '../config/Config';
import { FileService } from './file/file.service';

@Injectable()
export class AppService {
  constructor(
    private readonly mailerService: MailerService,
    ) {}
  
  sendEmail(body: any): void {
    this.mailerService
      .sendMail({
        to: config.EMAIL.login,
        from: config.EMAIL.login,
        subject: "Wiadomość z bloga",
        html: `<b>Imię i nazwisko: </b> ${body.fullname} <br />
              <b>Adres e-mail: </b> ${body.email} <br />
              <b>Number telefonu: </b> ${body.phone} <br />
              <b>Wiadomość: </b> ${body.message}`,
      })
      .then(() => {
        
      })
      .catch((error) => {
        throw new InternalServerErrorException();
      });
  }
}
