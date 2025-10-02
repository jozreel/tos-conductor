import {Router, json} from 'express';
import UserController from '../Controllers/user-controller';
import RequerstHandlers from '../Drivers/request-handlers';

const user_router =  Router();

const AddUserFactory = async(req: any) => {
    const ucont =  new UserController();
    return await ucont.AddUser(req);
}

user_router.post('/', [json()], RequerstHandlers(AddUserFactory));

export default user_router;