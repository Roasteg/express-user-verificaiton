import ServerError from "@/common/core/server_error";

export default class UserNotProvidedError extends ServerError {
  constructor() {
    super(500, "User is not provided!");
  }
}
