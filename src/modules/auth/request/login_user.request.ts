import type { Request } from "express";
import type LoginUserDTO from "../dto/login_user.dto";

export default interface LoginUserRequest extends Request {
    body: LoginUserDTO
}