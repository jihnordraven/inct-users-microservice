import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

type SendMailType = {
  email: string;
  subject: string;
  html: string;
};

@Injectable()
export class MailerAdapter {
  private NODEMAILER_SERV = process.env.NODEMAILER_SERV;
  private NODEMAILER_USER = process.env.NODEMAILER_USER;
  private NODEMAILER_PASS = process.env.NODEMAILER_PASS;

  constructor() {}

  private async options(options: SendMailOptions): Promise<void> {
    console.log(
      this.NODEMAILER_PASS,
      this.NODEMAILER_SERV,
      this.NODEMAILER_USER,
    );
    const transport: Transporter = createTransport({
      service: this.NODEMAILER_SERV,
      auth: {
        user: this.NODEMAILER_USER,
        pass: this.NODEMAILER_PASS,
      },
    });
    const isSuccess = await transport.sendMail(options);
    if (!isSuccess) throw new InternalServerErrorException();
  }

  public async sendMail(data: SendMailType): Promise<void> {
    this.options({
      to: data.email,
      from: 'IT-Incubator Inctagram',
      subject: data.subject,
      html: data.html,
    });
  }
}
