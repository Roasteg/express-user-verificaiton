import getEnvConfig from "@/helpers/env_config";
import { debug } from "console";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

getEnvConfig();

const transport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options);

export default async function sendMail(
  to: string,
  subject: string,
  text?: string,
  html?: string
): Promise<void> {
  try {
    await transport.sendMail({
      from: `Website name <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    debug("Email sent!");
  } catch (error) {
    debug(error);
  }
}
