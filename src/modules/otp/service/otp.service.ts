import Service from "@/common/core/service";
import OTP from "../model/otp";
import UserService from "@/modules/auth/service/user.service";
import UserNotFoundError from "../../../common/exception/user_not_found.exception";
import OtpGenerator from "otp-generator";
import User from "@/modules/auth/model/user";
import VerifyOTPDTO from "../dto/verify_otp.dto";
import OTPNotFoundOrExpiredError from "../exception/otp_not_found.exception";
import OTPIncorrectError from "../exception/otp_incorrect.exception";

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
      await this.delete(existingOTP);
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
  }

  async verifyOTP(
    verifyOTPDTO: VerifyOTPDTO,
    user: User | undefined
  ): Promise<void> {
    if (user === undefined) {
      throw new UserNotFoundError();
    }

    const otpForUser = await this.getOTPForUser(user);
    const currentDate = new Date(Date.now());

    if (otpForUser === null || currentDate > otpForUser.expiresAt!) {
      throw new OTPNotFoundOrExpiredError();
    }

    if (otpForUser.otp !== verifyOTPDTO.otp) {
      throw new OTPIncorrectError();
    }

    await this.delete(otpForUser);
  }

  async getOTPForUser(user: User): Promise<OTP | null> {
    const otp = this.findOne({
      where: {
        forUser: user,
      },
    });

    return otp;
  }
}
