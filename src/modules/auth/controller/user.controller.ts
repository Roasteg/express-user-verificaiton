import { Router, type Response } from "express";
import UserService from "../service/user.service";
import type CreateUserRequest from "../request/create_user.request";
import type LoginUserRequest from "../request/login_user.request";
import getEnvConfig from "@/helpers/env_config";
import Controller from "@/common/core/controller";
import getError from "@/common/helpers/get_error";
import { authenticateJwt } from "@/config/passport.config";
import ChangePasswordRequest from "../request/change_password.request";
import { debug } from "console";
import User from "../model/user";
import SuccessResponse from "@/common/core/success_response";
import ErrorResponse from "@/common/core/error_response";
import userIsActive from "@/common/middleware/user_is_active.middleware";

getEnvConfig();

const authRouter = Router();

authRouter.post("/register", async (req: CreateUserRequest, res: Response) => {
  const service = new UserService();
  try {
    const user = await service.registerUser(req.body);
    res.send(new SuccessResponse("Registration successful!", user));
  } catch (error) {
    const _error = getError(error);
    res
      .status(_error.status)
      .send(new ErrorResponse(_error.message, _error.status));
  }
});

authRouter.post("/login", async (req: LoginUserRequest, res: Response) => {
  const service = new UserService();
  try {
    const user = await service.loginUser(req.body);
    res.send(new SuccessResponse("Logged in successfully!", user));
  } catch (error) {
    const _error = getError(error);
    res
      .status(_error.status)
      .send(new ErrorResponse(_error.message, _error.status));
  }
});

authRouter.post(
  "/change-password",
  [authenticateJwt, userIsActive],
  async (req: ChangePasswordRequest, res: Response) => {
    const service = new UserService();
    try {
      await service.changePassword(req.body, req.user as User | undefined);
      res.send(new SuccessResponse("Password changed!"));
    } catch (error) {
      const _error = getError(error);
      res
        .status(_error.status)
        .send(new ErrorResponse(_error.message, _error.status));
    }
  }
);

export class AuthController extends Controller {
  static router: Router = authRouter;
}
