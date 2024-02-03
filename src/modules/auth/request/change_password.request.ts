import { Request } from "express";
import ChangePasswordDTO from "../dto/change_password.dto";
export default interface ChangePasswordRequest extends Request {
    body: ChangePasswordDTO
}