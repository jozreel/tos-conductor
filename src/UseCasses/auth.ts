import SessionDb from "../Db/sessiondb";
import AuthService from "../Drivers/auth-service";
import Session from "../Models/session";

class Auth {
    private _authservice: AuthService;
    private _sessiondb: SessionDb;
    public constructor(authservice: AuthService, sessiondb: SessionDb) {
        this._authservice = authservice;
        this._sessiondb =  sessiondb;

    }
    public  async GetToiken(req: any): Promise<any> {
        try {

            const {data} =  req;
            data.client_id = process.env.AUTH_CLIENT_ID;
            const res =  await this._authservice.GetToken(data);
            const refresh_token =  res.refresh.token;
            const pload: any =  await this._authservice.VerifyToken(refresh_token);
            const cdate =  new Date();
            const session = new Session(pload.session, refresh_token, pload.sub, cdate, cdate);
          
            await this._sessiondb.AddSession(session);
            
            const cookies = [
                {name: "refresh_session_cookie",
                    value: res.refresh.token,
                    options: {
                        httpOnly: true, // This is the crucial part
                        secure: process.env.NODE_ENV === 'production', 
                        maxAge: res.refresh.valid_until * 1000,
                        sameSite: 'Lax', 
                        path: '/' 
                    }
                }
            ]
            return {data: res, cookies, type: 'json'};

        } catch (ex) {
            console.log(ex);
            throw ex;
        }

    }

    public async RefreshToken(req: any): Promise<any> {
        try {
        
            const req_cookies = req.cookies;
            const token  = req_cookies.refresh_session_cookie;
            const data = req.data;
            data.token = token;
            const res =  await this._authservice.RefreshToken(data);
            const cookies = [
                {name: "refresh_session_cookie",
                    value: res.refresh.token,
                    options: {
                        httpOnly: true, // This is the crucial part
                        secure: process.env.NODE_ENV === 'production', 
                        maxAge: res.refresh.valid_until * 1000,
                        sameSite: 'Lax', 
                        path: '/' 
                    }
                }
            ]

            return {data: res, cookies, type: 'json'};

        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }


    public async Logout(req: any) {
        try {
            console.log('loging out user')
            const data = req.data;
            let res;
            await this._sessiondb.DelleteSession(data.sessionid);
            res = await this._authservice.Logout(data);
            
           
            const clearcookies = [
                {name: 'refresh_session_cookie', options: {
                    path: '/'
                }}, {
                    name: 'refresh_expiry',
                    options: {path: '/'}
                }];
            
            return {
                type: "redirect",
                clearcookies,
                url: res.url
            }


        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }

    public async UserInfoGet(req: any) {
        try {
            const userid =  req.params.userid;
            const creds =  req.credentials;
            const token =  req.cookies.refresh_session_cookie;
            let access_token;
            if(creds) {
                const cp =  creds.split(' ');
                access_token = cp.length === 2 ?  cp[1] : '';
            }
            const res = await this._authservice.UserUnfoGet({userid, token, access_token});
            return res;
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }


       public async UserInfoPost(req: any) {
        try {
            const userid =  req.data.userid;
            const creds =  req.credentials;
            const token =  req.cookies.refresh_session_cookie;
            let access_token;
            if(creds) {
                const cp =  creds.split(' ');
                access_token = cp.length === 2 ?  cp[1] : '';
            }
            const res = await this._authservice.UserUnfoPost({userid, token, access_token});
            return res;
        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }
}

export default Auth;