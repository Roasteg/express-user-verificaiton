export default class WrongCredentialsError extends Error {
    status: number;
    constructor() {
        super();
        this.message = "Wrong email/password!"
        this.status = 401;
    }

}