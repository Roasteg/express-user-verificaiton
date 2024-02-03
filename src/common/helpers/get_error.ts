import ServerError from "../core/server_error";

export default function getError(error: Error): ServerError {
  if (error instanceof ServerError) {
    return error;
  }
  return new ServerError(500, "Unexpected error");
}
