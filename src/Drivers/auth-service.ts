import { URLSearchParams } from "url";
import { TokenRequest } from "../Models/auth";
import fs from 'fs';
import crypto from 'crypto';
import { TokenExpiredError } from "../errors";
class AuthService  {
    private readonly _authUURL: string = process.env.AUTH_SERVICE || '';
    public async GetToken(req: TokenRequest): Promise<any> {
        try {
            
            const body: any = {...req}
            const params =  new URLSearchParams(body);
            params.append("grant_type", "authorization_code");
            const creds =  `${process.env.AUTH_CLIENT_ID}:${process.env.CLIENT_SECRET}`;
            const b64Creds =  Buffer.from(creds).toString("base64"); 
            console.log(this._authUURL)
            const res =  await fetch(`${this._authUURL}/api/token`, {
                body: params,
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${b64Creds}`
                }
            });

            if(!res.ok) {
                throw new Error("Could not get token");
            }

            const data =  await res.json();
            return data;

        } catch(ex) {
            throw ex;
        }
        
    }

    
    public async GetServiceAccountToken(req:TokenRequest): Promise<any> {
        try {
           
            const pdata: any  = {...req};
            const params =  new URLSearchParams(pdata);
            params.append('grant_type', "client_credentials");
            const creds =  `${process.env.AUTH_CLIENT_ID}:${process.env.CLIENT_SECRET}`;
            const b64Creds =  Buffer.from(creds).toString("base64");
            const res =  await fetch(`${this._authUURL}/api/token`, {
                body: params,
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${b64Creds}`
                }
            });
            if(!res.ok) {
                throw new Error("Could not get token");
            }
            const data =  await res.json();
            return data;

        } catch (ex: any) {

        }
    }


    public async RefreshToken(refreshdata: any): Promise<any> {
        try {
            const cookiename = 'refresh_session_cookie';
            const cookievalue =  refreshdata.token;
            const cookie =  `${cookiename}=${cookievalue}`;
            const params_data:any = {
                grant_type: 'refresh_token',
                sessionid: refreshdata.sessionid,
                client_id: process.env.AUTH_CLIENT_ID
            }
            const params = new URLSearchParams(params_data);
            const creds =  `${process.env.AUTH_CLIENT_ID}:${process.env.CLIENT_SECRET}`;
            const b64Creds =  Buffer.from(creds).toString("base64"); 
            const res = await fetch(`${this._authUURL}/api/token`, {
                body: params,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Authorization": `Basic ${b64Creds}`,
                    "Cookie": cookie
                }
            });
            if(!res.ok) {
                throw new Error("Something went wrong")
            } 
            
            const data = await res.json();
            return data;

        } catch(ex) {
            throw ex;
        }

    }


    public async Logout(data: any) {
        try {
            const cookiename = 'refresh_session_cookie';
            const cookievalue =  data.token;
            data.client_id =  process.env.AUTH_CLIENT_ID;
            const cookie =  `${cookiename}=${cookievalue}`;
            const params =  new URLSearchParams({...data});
            
            const res = await fetch(`${this._authUURL}/api/authorize/logout`, {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie": cookie
                }
            });
            if(res.redirected) {
                return {type: "redirect", url: res.url};
            } else {
               const ret = await res.json();
               return ret;
            }
        } catch (ex) {
            throw ex;
        }
    }

    public  VerifyToken = (jwt: any) => {
            const pub_key_file: string =  process.env.PUBLIC_KEY || '';
            const pub_key =  fs.readFileSync(pub_key_file);
            const parts = jwt.split('.');
            if(parts.length !== 3) {
                throw new Error("Invalid JWT format");
            }
            
            const [enc_header, enc_payload, enc_signature] =  parts;
            const enc_data = `${enc_header}.${enc_payload}`;
            const sigbuffer = Buffer.from(enc_signature, 'base64');
            const verifier =  crypto.createVerify('RSA-SHA256');
            verifier.update(enc_data);
            const verified =  verifier.verify(pub_key, sigbuffer);
    
            if(verified) {
                const pload = JSON.parse(Buffer.from(enc_payload, 'base64').toString('utf-8'));
                const now =  Math.floor(Date.now() / 1000) 
                if(pload.exp && pload.exp < now) {
                    console.log('expired');
                    throw new TokenExpiredError('Token has expired');
                }
                return pload;
            } else {
                throw new Error("Invalid token");
            }
        }

    public async UserUnfoGet(data: any) {
        try {
            const cookiename = 'refresh_session_cookie';
            const cookievalue =  data.token;
            const cookie =  `${cookiename}=${cookievalue}`;
            const res = await fetch(`${this._authUURL}/api/userinfo/`+data.userid, {
                headers: {
                    'Content-Type': 'application/json',
                    "Cookie": cookie,
                    "Authorization": `Bearer ${data.access_token}`
                }
            });
            if(!res.ok) {
                throw new Error("Oops something went wrong "+res.status);
            }
            return await res.json();

        } catch(ex) {
            throw ex;
        }
    }


    public async UserUnfoPost(data: any) {
        try {
            const cookiename = 'refresh_session_cookie';
            const cookievalue =  data.token;
            const cookie =  `${cookiename}=${cookievalue}`;
            const res = await fetch(`${this._authUURL}/api/userinfo`, {
                method: 'POST',
                body: JSON.stringify({userid: data.userid}),
                headers: {
                    'Content-Type': 'application/json',
                    "Cookie": cookie,
                    "Authorization": `Bearer ${data.access_token}`
                }
            });
            if(!res.ok) {
                throw new Error("Oops something went wrong "+res.status);
            }
            return await res.json();

        } catch(ex) {
            console.log(ex);
            throw ex;
        }
    }

    public async AddUser(usr: any, token: string): Promise<any> {
        try {

            //add user through back channel
            const res =  await fetch(`${this._authUURL}/api/user`, {
                method: 'POST',
                body: JSON.stringify(usr),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(!res.ok) {
                throw new Error("Oops something went wrong");
            }

            const dt = await res.json();
            return dt;

        } catch (ex) {
            throw ex;
        }
    }
}

export default AuthService;