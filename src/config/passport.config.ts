import _passport, { type PassportStatic, type DoneCallback } from "passport";
import {
    Strategy,
    ExtractJwt,
    type StrategyOptionsWithoutRequest,
    StrategyOptionsWithRequest,
} from "passport-jwt";
import type { JwtPayload } from "jsonwebtoken";
import getEnvConfig from "../helpers/env_config";
import UserService from "../modules/auth/service/user.service";
import { debug } from "console";
import getRawToken from "@/common/helpers/get_raw_token";

getEnvConfig();
const passport: PassportStatic = _passport;
const secretOrKey = process.env.JWT_SECRET ?? "";
const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const passReqToCallback = true;
const opts: StrategyOptionsWithRequest = {
    jwtFromRequest,
    secretOrKey,
    passReqToCallback
};

passport.use(
    new Strategy(opts, (req, jwtPayload: JwtPayload, done: DoneCallback): void => {
        const userService = new UserService();
        const passedToken = getRawToken(req.headers.authorization);
        userService.getUserAndVerifyToken(jwtPayload.username ?? "", passedToken).then((user) => {
            done(null, user);
        }).catch((error) => {
            done(error);
        })
    })
);

export const authenticateJwt = passport.authenticate("jwt", { session: false, });

