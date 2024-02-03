export default class CreateUserDTO {
    email: string;
    password: string;
    confirmPassword: string;

    constructor(email: string, password: string, confirmationPassword: string) {
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmationPassword;
    }
}