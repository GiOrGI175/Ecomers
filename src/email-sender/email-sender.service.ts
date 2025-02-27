import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';

@Injectable()
export class EmailSenderService {
  constructor(private emailService: MailerService) {}
  async sendEmailText(to: string, subject: string, text: string) {
    const options = {
      from: 'web-10 <gio.nozadze1.10@gmail.com>',
      to,
      subject,
      text,
    };

    try {
      const info = await this.emailService.sendMail(options);
      console.log('Email Sent Successfully', info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendEmailHtml(to: string, subject: string) {
    const html = `
        <div style="border: 2px solid black">
            <h1 style="color: red">Hello world</h1>
        </div>
        `;
    const options = {
      from: 'web-10 <gio.nozadze1.10@gmail.com>',
      to,
      subject,
      html,
    };

    try {
      const info = await this.emailService.sendMail(options);
      console.log('Email Sent Successfully', info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
