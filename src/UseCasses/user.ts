import UserDb from "../Db/user-db";
import { AccessDeniedError, DuplicateRecordError, RecordNotFoundError } from "../errors";
import { AppRequest } from "../types";
import {default as UserModel} from '../Models/user'
import AuthService from "../Drivers/auth-service";

class User {
    private userdb: UserDb;
    private authservice: AuthService;

    public constructor(user_db: UserDb, auth_service: AuthService) {
        this.userdb = user_db;
        this.authservice = auth_service;
    }

    public async AddUser(req: AppRequest) {
        try {
            const data =  req.data;

            const exist  = await this.userdb.GetUserByUsername(data.username);
            const creds: string =  req.credentials || '';
            const parts= creds.split(' ');
            if(parts.length !== 2) {
                throw new AccessDeniedError('Invalid credentials');
            }
            const authuser =  await this.authservice.AddUser({
                username: data.username,
                email: data.email,
                password: data.password,
            }, parts[1]);
            if(!authuser) {
                throw new RecordNotFoundError('Could not add user');
            }
            data.userid = authuser.id;
            if(exist) {
                throw new DuplicateRecordError('A user with this username already exist');
            }
            const user =  new UserModel(
                data.userid,
                new Date(),
                new Date(),
                req.access?.sub,
                req.access?.sub
            );
            const rec = await this.userdb.AddUser(data);


        } catch(ex) {
            throw ex;
        }
    }
}

export default User;