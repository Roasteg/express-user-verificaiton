import { Router, type Request, type Response } from "express";
import getEnvConfig from "@/helpers/env_config";
import { authenticateJwt } from "@/config/passport";
import Controller from "@/config/controller";

getEnvConfig();

const authRouter = Router();

authRouter.get("/me", [authenticateJwt], (req: Request, res: Response) => {
    res.send(200).json({ message: "hello world!" });
});

export class AuthController extends Controller {
    static router: Router = authRouter;
}
