import ServerError from "@/common/core/server_error";

export default class UserNotFoundError extends ServerError {
  constructor() {
    super(404, "User not found");
  }
}
