import ServerError from "@/common/core/server_error";

export default class UserAlreadyActivatedError extends ServerError {
  constructor() {
    super(500, "User is already activated!");
  }
}
