import User from "@/modules/auth/model/user";
import { type Request, type Response, NextFunction } from "express";
import UserNotFoundError from "../exception/user_not_found.exception";
import UserNotActiveError from "../exception/user_not_active.exception";

export default function userIsActive(req: Request, _, next: NextFunction) {
  const user = req.user as User | undefined;
  if (user === undefined) {
    throw new UserNotFoundError();
  }
  if (!user.isActive) {
    throw new UserNotActiveError();
  }
  next();
}
