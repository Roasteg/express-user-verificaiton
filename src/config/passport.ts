import _passport, { type PassportStatic, type DoneCallback } from "passport";
import {
    Strategy,
    ExtractJwt,
    type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import type { JwtPayload } from "jsonwebtoken";
import getEnvConfig from "../helpers/env_config";
import UserService from "../modules/auth/service/user.service";

getEnvConfig();
const passport: PassportStatic = _passport;
const secretOrKey = process.env.JWT_SECRET ?? "";
const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const audience = "test.website.com";
const opts: StrategyOptionsWithoutRequest = {
    jwtFromRequest,
    secretOrKey,
    audience,
};

passport.use(
    new Strategy(opts, (jwtPayload: JwtPayload, done: DoneCallback): void => {
        const userService = new UserService();

        userService
            .getUserById(parseInt(jwtPayload.sub ?? ""))
            .then((user) => {
                done(null, user);
            })
            .catch((_error) => {
                done(_error, false);
            });
    })
);

export const authenticateJwt = passport.authenticate("jwt", { session: false });

