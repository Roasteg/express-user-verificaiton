import type User from "../model/user";

export default class UserDTO {
    email: string;
    token: string;

    constructor(email: string, token: string) {
        this.email = email;
        this.token = token;
    }

    static fromEntity(user: User): UserDTO {
        return new UserDTO(user.email, user.latestAccessToken);
    }
}
