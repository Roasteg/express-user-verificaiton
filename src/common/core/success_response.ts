
export default class SuccessResponse {
    message: string;
    status: number;
    data?: object | object[];

    constructor(message: string, data?: object | object[]) {
        this.message = message;
        this.status = 200;
        this.data = data;
    }
}