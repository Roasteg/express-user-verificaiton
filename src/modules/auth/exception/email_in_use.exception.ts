import ServerError from "@/common/core/server_error";

export default class EmailInUseError extends ServerError {
  constructor() {
    super(409, "Email already in use!");
  }
}
