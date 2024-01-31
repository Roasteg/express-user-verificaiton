/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, beforeEach, afterEach, } from "vitest";
import { anyNumber, anyString, spy, reset, when, mock, instance } from "ts-mockito";
import UserService from "@/modules/auth/service/user.service";
import type User from "@/modules/auth/model/user";
import type UserDTO from "@/modules/auth/dto/user.dto";
import type LoginUserDTO from "@/modules/auth/dto/login_user.dto";
import WrongCredentialsError from "@/modules/auth/exception/wrong_credentials.exception";

describe("User service tests", () => {
    let serviceMock: UserService;
    let serviceInstance: UserService;
    let serviceSpy: UserService;
    const service: UserService = new UserService();

    beforeEach(() => {
        serviceMock = mock(UserService);
        serviceInstance = instance(serviceMock);
        serviceSpy = spy(service);
    });

    afterEach(()=> {
        reset(serviceSpy);
        reset(serviceMock);
    })

    const email = "testemail@mail.com";
    const token = "token";
    const password = "password";

    const testUser: User = {
        email,
        latestAccessToken: "token",
        id: 1,
        hash: password,
        isGoogleLogin: false,
        latestLogin: new Date(),
    };

    const testLoginDTO: LoginUserDTO = {
        email,
        password,
    };

    const testUserDTO: UserDTO = {
        email,
        token,
    };

    describe("Success cases", () => {
        it("Should find and return user by id", async () => {
            when(serviceMock.getUserById(anyNumber())).thenResolve(testUser);
            const user = await serviceInstance.getUserById(1);

            expect(user).toHaveProperty("id", 1);
        });

        it("Should return user email and token when successfully logged in", async () => {
            when(serviceMock.generateToken(email)).thenReturn(token);
            when(serviceMock.loginUser(testLoginDTO)).thenResolve(testUserDTO);
            const user = await serviceInstance.loginUser(testLoginDTO);

            expect(user).toBe(testUserDTO);
        });
    });

    describe("Failed cases", () => {
        it("Should throw error when user is not found when logging in", async () => {
            when(serviceSpy.getUserByEmail(anyString())).thenResolve(null);
            when(serviceSpy.generatePasswordHash(anyString())).thenReturn('wrong-hash');

            await expect(service.loginUser(testLoginDTO)).rejects.toThrow(WrongCredentialsError);
        });
    })

});