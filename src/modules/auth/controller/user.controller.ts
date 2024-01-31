import { Router, type Request, type Response } from "express";
import UserService from "../service/user.service";
import type CreateUserRequest from "../request/create_user.request";
import WrongCredentialsError from "../exception/wrong_credentials.exception";
import type LoginUserRequest from "../request/login_user.request";
import getEnvConfig from "@/helpers/env_config";
import { authenticateJwt } from "@/config/passport";
import Controller from "@/config/controller";

getEnvConfig();

const authRouter = Router();

authRouter.get("/me", [authenticateJwt], (req: Request, res: Response) => {
    res.send(200).json({ message: "hello world!" });
});

authRouter.post("/register", async (req: CreateUserRequest, res: Response) => {
    const service = new UserService();

    const user = await service.registerUser(req.body);

    res.status(200).send(user);
});

authRouter.post("/login", async (req: LoginUserRequest, res: Response) => {
    const service = new UserService();

    try {

        const user = await service.loginUser(req.body);
        
        res.status(200).send(user);
    } catch (_error) {
        if(_error instanceof WrongCredentialsError) {
            res.status(_error.status).send({message: _error.message});
        }
    }
});

export class AuthController extends Controller {
    static router: Router = authRouter;
}
