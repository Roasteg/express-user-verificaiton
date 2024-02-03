import ServerError from "@/common/core/server_error";

export default class WrongCredentialsError extends ServerError {
  constructor() {
    super(401, "Wrong email/password");
  }
}
