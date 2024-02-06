import SendOTPDTO from "../dto/send_otp.dto";
import type { Request } from "express";

export default interface SendOTPRequest extends Request {
    body: SendOTPDTO
}