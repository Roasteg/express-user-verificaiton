import { Router, type Request, type Response } from "express";
import getEnvConfig from "@/helpers/env_config";
import { authenticateJwt } from "@/config/passport";
import Controller from "@/config/controller";
import CreateUserRequest from "../request/create_user.request";
import UserService from "../service/user.service";

getEnvConfig();

const authRouter = Router();

authRouter.get("/me", [authenticateJwt], (req: Request, res: Response) => {
    res.send(200).json({ message: "hello world!" });
});

authRouter.post("/register", async (req: CreateUserRequest, res: Response) => {
    const service = new UserService();
    const user = await service.registerUser(req.body);
    res.status(200).send(user);
})

export class AuthController extends Controller {
    static router: Router = authRouter;
}
