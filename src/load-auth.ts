import { access } from 'fs';
import AuthService from './Drivers/auth-service';
import { TokenExpiredError } from './errors';

let accessToken: any = null
let refreshToken:any =  null;

const LoadAuth = async(): Promise<any> => {
    try {
        console.log(new Date().toLocaleString() +' Fetching auth app creds');
        const as = new AuthService();
        const appTokens = await as.GetServiceAccountToken({
            cred_type: 'client_credentials',
            client_id: process.env.AUTH_CLIENT_ID ||'',
            code: '',
            loginid: '',
            offline_access: true

        });
        console.log(new Date().toLocaleString()+ ' App auth creds loaded');
        accessToken =  appTokens.access.token;
        refreshToken =  appTokens.refresh.token;
        return {accessToken, refreshToken}


    } catch(ex) {
        throw ex;
    }

}
export const RefreshAuth = async () => {
    try {
        console.log(`${new Date().toLocaleString()} refreshing token`)
        const as =  new AuthService();
        const ref = await as.RefreshToken({
            cred_type: 'refresh_token',
            client_id: process.env.AUTH_CLIENT_ID,
            token: refreshToken
        });

        accessToken =  ref.access.token;
        refreshToken = ref.refresh.token;
        console.log(`${new Date().toLocaleString()} token refresh successfull`)

    } catch (ex: any) {
        console.error('Could not retreive new token')
    }
}
export const GetAccessTokens = async ():Promise<any> => {
    try {
        const authservice =  new AuthService();
     
        if(accessToken && !authservice.VerifyToken(accessToken)) {
            return await LoadAuth();
        } else {
            return {
                accessToken,
                refreshToken

            }
        }
    } catch(ex:any) {
        if(ex instanceof TokenExpiredError) {
            await RefreshAuth()
        }
        throw ex;
    }
    
}

export default LoadAuth;