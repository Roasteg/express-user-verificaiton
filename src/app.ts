import { debug } from "console";
import express from "express";
import morgan from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import { AppDataSource } from "./config/datasource.config";
import { AuthController } from "./modules/auth/controller/user.controller";
import getEnvConfig from "./helpers/env_config";
import ServerError from "./common/core/server_error";

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

app.use((err, req, res, next) => {
  if (err instanceof ServerError) {
    return res.status(err.status).send({ message: err.message });
  }
  return next(err);
});
AppDataSource.initialize()
  .then(() => {
    app.listen(portHttp, () => {
      debug(`listening on port ${portHttp}`);
    });
  })
  .catch((_error) => {
    debug(_error);
  });
