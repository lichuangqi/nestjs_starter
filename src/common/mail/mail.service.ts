import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type JSONTransport from 'nodemailer/lib/json-transport';

@Injectable()
export class MailService implements OnModuleDestroy {
  private readonly transporter: Transporter;
  private readonly defaultFrom: string;

  constructor(configService: ConfigService) {
    const enabled = configService.get<boolean>('MAIL_ON', false);
    const user = configService.get<string>('MAIL_USER', '');
    const pass = configService.get<string>('MAIL_PASSWORD', '');

    this.defaultFrom = configService.get<string>(
      'MAIL_FROM',
      'NestJS Starter <noreply@example.com>',
    );
    this.transporter = enabled
      ? nodemailer.createTransport({
            host: configService.get<string>('MAIL_HOST', 'localhost'),
            port: configService.get<number>('MAIL_PORT', 1025),
            secure: false,
            auth: user && pass ? { user, pass } : undefined,
          } satisfies SMTPTransport.Options)
      : nodemailer.createTransport({
          jsonTransport: true,
        } satisfies JSONTransport.Options);
  }

  send(options: SendMailOptions) {
    return this.transporter.sendMail({ from: this.defaultFrom, ...options });
  }

  sendMail(options: SendMailOptions & { template?: string; context?: unknown }) {
    const { template: _template, context, ...mailOptions } = options;
    const text =
      mailOptions.text ??
      (context ? `Template context: ${JSON.stringify(context)}` : undefined);
    return this.send({ ...mailOptions, text });
  }

  onModuleDestroy() {
    this.transporter.close();
  }
}
