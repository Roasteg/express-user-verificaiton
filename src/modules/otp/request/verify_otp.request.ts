import { Request } from "express";
import VerifyOTPDTO from "../dto/verify_otp.dto";
export default interface VerifyOTPRequest extends Request {
  body: VerifyOTPDTO;
}
