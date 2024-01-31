import type {Request} from 'express'; 
import type CreateUserDTO from '../dto/create_user.dto';

export default interface CreateUserRequest extends Request {
    body: CreateUserDTO
}