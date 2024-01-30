import { debug } from "console";
import express from "express";
import morgan from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import { AppDataSource } from "./config/datasource";
import { AuthController } from "./modules/auth/controller/user.controller";
import getEnvConfig from "./helpers/env_config";

const app = express();
const router = express.Router();
const portHttp = 8000;
const logger = morgan("common");

getEnvConfig();


app.use(helmet());
app.use(express.json());
app.use(logger);
app.use(methodOverride());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(router);
app.use(passport.initialize());

router.use("/auth", AuthController.router);

AppDataSource.initialize()
    .then(() => {
        app.listen(portHttp, () => {
            debug(`listening on port ${portHttp}`);
        });
    })
    .catch((_error) => {
        debug(_error);
    });
