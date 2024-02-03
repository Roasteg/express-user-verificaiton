import ServerError from "@/common/core/server_error";

export default class PasswordsNotMatchingError extends ServerError {
  constructor() {
    super(500, "Passwords do not match!");
  }
}
