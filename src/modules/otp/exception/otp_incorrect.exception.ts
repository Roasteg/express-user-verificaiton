import ServerError from "@/common/core/server_error";

export default class OTPIncorrectError extends ServerError {
  constructor() {
    super(403, "Invalid OTP");
  }
}
