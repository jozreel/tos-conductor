import SessionDb from "../Db/sessiondb";
import AuthService from "../Drivers/auth-service";
import Auth from "../UseCasses/auth";

class AuthController {
    private _auth: Auth

    public constructor() {
        const authService =  new AuthService();
        const sessiondb = new SessionDb();
        this._auth = new Auth(authService, sessiondb);
    }

    public async GetToken(req:any) {
        try {
            const res =  await this._auth.GetToiken(req);
            return {type: res.type, body: res.data, statusCode: 200, cookies: res.cookies}

        } catch(ex: any) {
            return {body: {message: ex.message}, statusCode: 400}
        }
    }

    public async RefreshToken(req: any) {
        try {
            const res =  await this._auth.RefreshToken(req);
            return {type: res.type, body: res.data, statusCode: 200, cookies: res.cookies}

        } catch (ex:any) {
            return {body: {message: ex.message}, statusCode: 400}
        }
    }

    public async Logout(req: any) {
        try {
            const res:any =  await this._auth.Logout(req);
            if(res.type === 'redirect') {
                console.log(res);
                return {type: 'redirect', url: res.url, statusCode: 301, clearcookies: res.clearcookies}
            } else {
                return {body: res.data, statusCode: 400}
            }
        } catch(ex: any) {
              return {body: {message: ex.message}, statusCode: 400}
        
        }
    }

    public async UserInfoGet(req: any) {
        try {
            const res =  await this._auth.UserInfoGet(req);
            return {body: res, statusCode: 200}

        } catch(ex: any) {
            throw ex;
        }
    }

      public async UserInfoPost(req: any) {
        try {
            const res =  await this._auth.UserInfoPost(req);
            return {body: res, statusCode: 200}

        } catch(ex: any) {
            throw ex;
        }
    }
    

}
export default AuthController;