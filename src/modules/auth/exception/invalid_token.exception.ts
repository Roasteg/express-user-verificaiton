import ServerError from "@/common/core/server_error";

export default class InvalidTokenError extends ServerError {
  constructor() {
    super(403, "Invalid token provided!");
  }
}
