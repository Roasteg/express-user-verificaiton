import { Code, DataSource } from "typeorm";
import getEnvConfig from "../helpers/env_config";
import Client from "../modules/auth/model/client";
import AccessToken from "../modules/auth/model/access_token";
import RefreshToken from "../modules/auth/model/refresh_token";

getEnvConfig();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    logging: true,
    entities: [
        Client,
        Code,
        AccessToken,
        RefreshToken,
    ]
}); 