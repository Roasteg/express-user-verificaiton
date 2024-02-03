import ServerError from "@/common/core/server_error";

export default class WrongOldPasswordError extends ServerError {
  constructor() {
    super(403, "Old password do not match!");
  }
}
