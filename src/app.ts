import { debug } from "console";
import express from "express";
import morgan from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./config/datasource";

const app = express();
const router = express.Router();
const portHttp = 8000;
const logger = morgan("common");

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

AppDataSource.initialize().then(() => {
    app.listen(portHttp, () => {
        debug(`listening on port ${portHttp}`);
    });
}).catch((error) => debug(error));

