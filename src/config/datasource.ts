import { DataSource } from "typeorm";
import getEnvConfig from "../helpers/env_config";
import User from "@/modules/auth/model/user";

getEnvConfig();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [User],
    synchronize: true
});
