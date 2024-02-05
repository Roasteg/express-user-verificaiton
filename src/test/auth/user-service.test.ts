/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, beforeEach, afterEach, } from "vitest";
import { anyNumber, anyString, anything, spy, reset, when, mock, instance } from "ts-mockito";
import UserService from "@/modules/auth/service/user.service";
import type User from "@/modules/auth/model/user";
import type UserDTO from "@/modules/auth/dto/user.dto";
import type LoginUserDTO from "@/modules/auth/dto/login_user.dto";
import WrongCredentialsError from "@/modules/auth/exception/wrong_credentials.exception";
import type ChangePasswordDTO from "@/modules/auth/dto/change_password.dto";
import WrongOldPasswordError from "@/modules/auth/exception/wrong_old_password.exception";
import PasswordsNotMatchingError from "@/modules/auth/exception/passwords_not_matching.exception";
import InvalidTokenError from "@/modules/auth/exception/invalid_token.exception";
import type CreateUserDTO from "@/modules/auth/dto/create_user.dto";
import EmailInUseError from "@/modules/auth/exception/email_in_use.exception";

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
    const newPassword = "password1";

    const testUser: User = {
        email,
        latestAccessToken: token,
        id: 1,
        hash: password,
        isGoogleLogin: false,
        latestLogin: new Date(),
        isActive: false
    };

    const testLoginDTO: LoginUserDTO = {
        email,
        password,
    };

    const testCreateDTO: CreateUserDTO = {
        email,
        password,
        confirmPassword: password
    }
    const testCreateWrongDTO: CreateUserDTO = {
        email,
        password,
        confirmPassword: "wrong-password"
    }

    const testUserDTO: UserDTO = {
        email,
        token,
    };

    const testChangePassDTO: ChangePasswordDTO = {
        newPassword,
        confirmNewPassword: newPassword,
        oldPassword: password,
        otp: "123456"
    }
    const testChangePassWrongDTO: ChangePasswordDTO = {
        newPassword,
        confirmNewPassword: "wrong-password",
        oldPassword: password,
        otp: "123456"
    }

    describe("Success cases", () => {
        it("Should find and return user by id", async () => {
            when(serviceMock.getUserById(anyNumber())).thenResolve(testUser);
            const user = await serviceInstance.getUserById(1);

            expect(user).toHaveProperty("id", 1);
        });
        describe("Auth", () => {
            it("Should return user email and token when successfully logged in", async () => {
                when(serviceMock.generateToken(email)).thenReturn(token);
                when(serviceMock.loginUser(testLoginDTO)).thenResolve(testUserDTO);
                const user = await serviceInstance.loginUser(testLoginDTO);
    
                expect(user).toBe(testUserDTO);
            });
            it("Should return user email and token when successfully registered", async () => {
                when(serviceSpy.getUserByEmail(email)).thenResolve(null);
                when(serviceSpy.generatePasswordHash(password)).thenReturn(password);
                when(serviceSpy.generateToken(email)).thenReturn(token);
                when(serviceSpy.saveUser(anything())).thenResolve(testUser);
                when(serviceSpy.createOTP(anything())).thenResolve(); 

                await expect(service.registerUser(testCreateDTO)).resolves.toEqual(testUserDTO);
            });
        });
    });

    describe("Fail cases", () => {
        describe("Auth", () => {
            it("Should throw an error when provided user token is not valid", async () => {
                when(serviceSpy.getUserByEmail(email)).thenResolve(testUser);
                await expect(service.getUserAndVerifyToken(email, "wrong-token")).rejects.toThrowError(InvalidTokenError)
            });
            it("Should throw an error when user is not found when logging in", async () => {
                when(serviceSpy.getUserByEmail(anyString())).thenResolve(null);
                when(serviceSpy.generatePasswordHash(anyString())).thenReturn('wrong-hash');
    
                await expect(service.loginUser(testLoginDTO)).rejects.toThrowError(WrongCredentialsError);
            });
            it("Should throw an error when user passwords are not matching while creating an account", async () => {
                await expect(service.registerUser(testCreateWrongDTO)).rejects.toThrowError(PasswordsNotMatchingError);
            });
            it("Should throw an error when user already exists while creating an account", async () => {
                when(serviceSpy.getUserByEmail(anyString())).thenResolve(testUser);

                await expect(service.registerUser(testCreateDTO)).rejects.toThrowError(EmailInUseError);
            });
        })
        
        describe("Change password", () => {
            it("Should throw an error if old password is wrong", async () => {
                when(serviceSpy.generatePasswordHash(password)).thenReturn('wrong-hash');
                await expect(service.changePassword(testChangePassDTO, testUser)).rejects.toThrowError(WrongOldPasswordError);
            })

            it("Should throw error if passwords do not match", async () => {
                when(serviceSpy.generatePasswordHash(password)).thenReturn(password);
                await expect(service.changePassword(testChangePassWrongDTO, testUser)).rejects.toThrowError(PasswordsNotMatchingError);
            })
        });
    })

});