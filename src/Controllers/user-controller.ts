import SessionDb from "../Db/sessiondb";
import UserDb from "../Db/user-db";
import AuthService from "../Drivers/auth-service";
import { AppRequest } from "../types";
import User from "../UseCasses/user";

class UserController {
    private  _user: User;
    
    public constructor() {
        this._user =  new User(new UserDb(), new AuthService(), new SessionDb());
    }

    public async AddUser(req: AppRequest): Promise<any> {
        try {
            const res =  await this._user.AddUser(req);
            console.log('yas')
            return {
                body: res,
                statusCode: 201
            }

        } catch(ex: any) {
            return {body: {message: ex.message}, statusCode: 400}
        }
    }
}


export default UserController;