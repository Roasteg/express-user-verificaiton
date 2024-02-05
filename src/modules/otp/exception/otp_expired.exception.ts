import ServerError from "@/common/core/server_error";

export default class OTPExpiredError extends ServerError {
  constructor() {
    super(410, "OTP expired!");
  }
}
