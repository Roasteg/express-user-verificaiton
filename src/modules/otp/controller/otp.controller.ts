import { Router, type Request, type Response } from "express";
import VerifyOTPRequest from "../../auth/request/verify_otp.request";
import OTPService from "../service/otp.service";
import UserService from "@/modules/auth/service/user.service";
import SuccessResponse from "@/common/core/success_response";
import getError from "@/common/helpers/get_error";
import ErrorResponse from "@/common/core/error_response";
import User from "@/modules/auth/model/user";
import Controller from "@/common/core/controller";
import SendOTPRequest from "../requets/send_otp.request";

const otpRouter = Router();

otpRouter.post(
  "/send",
  async (req: SendOTPRequest, res: Response) => {

    const userService = new UserService();
    const service = new OTPService(userService);
    try {
      await service.createOTP(req.body);
      res.send(new SuccessResponse("OTP sent!"));
    } catch (error) {
      const _error = getError(error);
      res
        .status(_error.status)
        .send(new ErrorResponse(_error.message, _error.status));
    }
  }
);

export default class OTPController extends Controller {
  static router: Router = otpRouter;
}
