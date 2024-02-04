import ServerError from "@/common/core/server_error";

export default class UserNotActiveError extends ServerError {
  constructor() {
    super(403, "User is not activated!");
  }
}
