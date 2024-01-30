import { Code, DataSource } from "typeorm";
import getEnvConfig from "../helpers/env_config";

getEnvConfig();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    logging: true,
    entities: [Code],
});
