import { DataSource } from "typeorm";
import getEnvConfig from "../helpers/env_config";
import User from "@/modules/auth/model/user";
import OTP from "@/modules/otp/model/otp";

getEnvConfig();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  entities: [User, OTP],
  synchronize: true,
});
