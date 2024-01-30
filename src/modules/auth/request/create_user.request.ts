import {Request} from 'express'; 
import CreateUserDTO from '../dto/create_user.dto';
export default interface CreateUserRequest extends Request {
    body: CreateUserDTO
}