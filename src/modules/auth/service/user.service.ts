import md5 from "md5";
import jwt from "jsonwebtoken";
import type CreateUserDTO from "../dto/create_user.dto";
import User from "../model/user";
import UserDTO from "../dto/user.dto";
import type LoginUserDTO from "../dto/login_user.dto";
import WrongCredentialsError from "../exception/wrong_credentials.exception";
import PasswordsNotMatchingError from "../exception/passwords_not_matching.exception";
import EmailInUseError from "../exception/email_in_use.exception";
import type ChangePasswordDTO from "../dto/change_password.dto";
import UserNotProvidedError from "../exception/user_not_provided.exception";
import WrongOldPasswordError from "../exception/wrong_old_password.exception";
import InvalidTokenError from "../exception/invalid_token.exception";
import getEnvConfig from "@/helpers/env_config";
import Service from "@/common/core/service";
import OTPService from "@/modules/otp/service/otp.service";
import VerifyOTPDTO from "@/modules/otp/dto/verify_otp.dto";

getEnvConfig();
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

export default class UserService extends Service<User> {
  private otpService: OTPService; 
  constructor() {
    super(User);
    this.otpService = new OTPService(this);
  }

  async registerUser(createUserDTO: CreateUserDTO): Promise<UserDTO> {
    if (createUserDTO.password !== createUserDTO.confirmPassword) {
      throw new PasswordsNotMatchingError();
    }

    if ((await this.getUserByEmail(createUserDTO.email)) !== null) {
      throw new EmailInUseError();
    }

    const passwordHash = this.generatePasswordHash(createUserDTO.password);
    const token = this.generateToken(createUserDTO.email);

    const user = await this.saveUser({
      email: createUserDTO.email,
      id: 0,
      isGoogleLogin: false,
      latestAccessToken: token,
      hash: passwordHash,
      latestLogin: new Date(),
    });

    await this.createOTP(user);

    return UserDTO.fromEntity(user);
  }

  async loginUser(loginUserDTO: LoginUserDTO): Promise<UserDTO> {
    const user = await this.getUserByEmail(loginUserDTO.email);

    if (
      user === null ||
      this.generatePasswordHash(loginUserDTO.password) !== user.hash
    ) {
      throw new WrongCredentialsError();
    }

    const token = this.generateToken(loginUserDTO.email);

    await this.update(user.id, {
      latestAccessToken: token,
      latestLogin: new Date(),
    });

    return new UserDTO(loginUserDTO.email, token);
  }

  async changePassword(
    changePasswordDTO: ChangePasswordDTO,
    user?: User
  ): Promise<void> {
    if (user === undefined) {
      throw new UserNotProvidedError();
    }

    const newPassword = this.generatePasswordHash(
      changePasswordDTO.newPassword
    );

    if (
      this.generatePasswordHash(changePasswordDTO.oldPassword) !== user.hash
    ) {
      throw new WrongOldPasswordError();
    }
    if (
      changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword
    ) {
      throw new PasswordsNotMatchingError();
    }

    await this.otpService.verifyOTP(
      new VerifyOTPDTO(changePasswordDTO.otp),
      user
    );

    await this.update(user.id, {
      hash: newPassword,
    });
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  async getUserAndVerifyToken(email: string, token: string): Promise<User> {
    const user = await this.getUserByEmail(email);

    if (user === null || user.latestAccessToken !== token) {
      throw new InvalidTokenError();
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ where: { email } });

    return user;
  }

  async saveUser(user: User): Promise<User> {
    const savedUser = await this.save(user);

    return savedUser;
  }

  async createOTP(user: User): Promise<void> {
    await this.otpService.createOTP(user);
  }

  async activateUser(user: User): Promise<void> {
    await this.update(user.id, {
      isActive: true,
    });
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
