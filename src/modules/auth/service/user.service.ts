import md5 from "md5";
import jwt from "jsonwebtoken";
import type CreateUserDTO from "../dto/create_user.dto";
import User from "../model/user";
import UserDTO from "../dto/user.dto";
import type LoginUserDTO from "../dto/login_user.dto";
import WrongCredentialsError from "../exception/wrong_credentials.exception";
import Service from "@/config/service";
import getEnvConfig from "@/helpers/env_config";

getEnvConfig();
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

export default class UserService extends Service<User> {
    constructor() {
        super(User);
    }

    async registerUser(createUserDTO: CreateUserDTO): Promise<UserDTO> {
        if (createUserDTO.password !== createUserDTO.confirmationPassword) {
            throw new Error("Passwords do not match");
        }

        if ((await this.getUserByEmail(createUserDTO.email)) !== null) {
            throw new Error("Email already in use!");
        }

        const passwordHash = this.generatePasswordHash(createUserDTO.password);
        const token = this.generateToken(createUserDTO.email);

        const user = await this.save({
            email: createUserDTO.email,
            id: 0,
            isGoogleLogin: false,
            latestAccessToken: token,
            hash: passwordHash,
            latestLogin: new Date(),
        });

        return UserDTO.fromEntity(user);
    }

    async loginUser(loginUserDTO: LoginUserDTO): Promise<UserDTO> {
        const user = await this.getUserByEmail(loginUserDTO.email);

        if (user === null || this.generatePasswordHash(loginUserDTO.password) !== user.hash) {
            throw new WrongCredentialsError();
        }

        const token = this.generateToken(loginUserDTO.email);

        await this.update(user.id, {
            latestAccessToken: token,
            latestLogin: new Date(),
        });

        return new UserDTO(loginUserDTO.email, token);
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.findOne({
            where: {
                id,
            },
        });

        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.findOne({ where: { email } });

        return user;
    }

    generatePasswordHash(password: string): string {
        return md5(password) as string;
    }

    generateToken(email: string): string {
        return jwt.sign(
            {
                username: email,
                issuedAt: new Date(),
            },
            jwtSecret ?? "",
            {
                expiresIn: jwtExpiration ?? "60d",
            }
        );
    }
}
