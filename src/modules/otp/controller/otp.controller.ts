import { Router, type Request, type Response } from "express";
import VerifyOTPRequest from "../request/verify_otp.request";
import OTPService from "../service/otp.service";
import UserService from "@/modules/auth/service/user.service";
import SuccessResponse from "@/common/core/success_response";
import getError from "@/common/helpers/get_error";
import ErrorResponse from "@/common/core/error_response";
import { authenticateJwt } from "@/config/passport.config";
import User from "@/modules/auth/model/user";
import Controller from "@/common/core/controller";

const otpRouter = Router();

otpRouter.post(
  "/verify",
  [authenticateJwt],
  async (req: VerifyOTPRequest, res: Response) => {
    const userService = new UserService();
    const service = new OTPService(userService);
    try {
      await service.verifyOTP(req.body, req.user as User | undefined);
      res.send(new SuccessResponse("OTP Verified!"));
    } catch (error) {
      const _error = getError(error);
      res
        .status(_error.status)
        .send(new ErrorResponse(_error.message, _error.status));
    }
  }
);

otpRouter.post(
  "/send",
  [authenticateJwt],
  async (req: Request, res: Response) => {
    const userService = new UserService();
    const service = new OTPService(userService);
    try {
      await service.createOTP(req.user as User | undefined);
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
