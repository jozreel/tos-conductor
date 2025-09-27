import UserDb from "../Db/user-db";
import { AccessDeniedError, DuplicateRecordError, RecordNotFoundError } from "../errors";
import { AppRequest } from "../types";
import {default as UserModel} from '../Models/user'
import AuthService from "../Drivers/auth-service";
import SessionDb from "../Db/sessiondb";

class User {
    private userdb: UserDb;
    private authservice: AuthService;
    private sessiondb: SessionDb

    public constructor(user_db: UserDb, auth_service: AuthService, session_db: SessionDb) {
        this.userdb = user_db;
        this.authservice = auth_service;
        this.sessiondb = session_db;
    }

    public async AddUser(req: AppRequest) {
        try {
            const data =  req.data;

            const exist  = await this.userdb.GetUserByUsername(data.username);
            const creds: string =  req.credentials || '';
            const parts= creds.split(' ');
            const client_session = await this.sessiondb.GetSessionForUser(process.env.CLIENT_ID||'');
            try {
                const tkd =  await this.authservice.VerifyToken(client_session?.Token);

            } catch (ex:any) {
                if(ex.name === 'TokenExpiredError') {
                    const tk =  await this.authservice.RefreshToken({
                        client_id: process.env.AUTH_CLIENT_ID,
                        token: client_session?.RefreshToken
                    });

                    
                }

            }
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