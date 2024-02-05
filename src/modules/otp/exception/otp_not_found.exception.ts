import ServerError from "@/common/core/server_error";

export default class OTPNotFoundError extends ServerError {
  constructor() {
    super(404, "OTP for current user not found!");
  }
}
