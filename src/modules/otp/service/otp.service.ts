import Service from "@/common/core/service";
import OTP from "../model/otp";
import UserService from "@/modules/auth/service/user.service";
import UserNotFoundError from "../../../common/exception/user_not_found.exception";
import OtpGenerator from "otp-generator";
import User from "@/modules/auth/model/user";
import VerifyOTPDTO from "../../auth/dto/verify_otp.dto";
import OTPNotFoundOrExpiredError from "../exception/otp_not_found.exception";
import OTPIncorrectError from "../exception/otp_incorrect.exception";
import sendMail from "@/common/core/send_mail";
import { debug } from "console";
import OTPNotFoundError from "../exception/otp_not_found.exception";
import OTPExpiredError from "../exception/otp_expired.exception";

export default class OTPService extends Service<OTP> {
  private userService: UserService;

  constructor(userService: UserService) {
    super(OTP);
    this.userService = userService;
  }

  async createOTP(user: User | undefined): Promise<void> {
    if (user === undefined) {
      throw new UserNotFoundError();
    }

    const existingOTP = await this.getOTPForUser(user);
    if (existingOTP !== null) {
      await this.delete({ id: existingOTP.id });
    }

    const otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await this.save({
      forUser: user,
      id: 0,
      otp,
    });

    await this.sendOTPEmail(user.email, otp);
  }

  async verifyOTP(otp: string, user: User): Promise<void> {
    const otpForUser = await this.getOTPForUser(user);
    const currentDate = new Date(Date.now());

    if (otpForUser === null) {
      throw new OTPNotFoundError();
    }

    if (currentDate > otpForUser.expiresAt!) {
      throw new OTPExpiredError();
    }

    if (otpForUser.otp !== otp) {
      throw new OTPIncorrectError();
    }

    await this.delete({ id: otpForUser.id });
  }

  async getOTPForUser(user: User): Promise<OTP | null> {
    const otp = this.findOne({
      where: {
        forUser: user,
      },
    });

    return otp;
  }

  async sendOTPEmail(to: string, otp: string): Promise<void> {
    const html = `<h1>Here is your OTP for website. It expires in 5 minutes</h1><br><b>${otp}</b>`;
    try {
      await sendMail(to, "Your otp code", undefined, html);
    } catch (error) {
      debug(error);
    }
  }
}
