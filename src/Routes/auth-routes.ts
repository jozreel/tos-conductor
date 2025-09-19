import {Router, urlencoded} from 'express';
import AuthController from '../Controllers/auth-controller';
import RequerstHandlers from '../Drivers/request-handlers';
import cookieparser from 'cookie-parser';

const auth_router = Router();

const get_token_factory = async (req:any) => {
    const authController =  new AuthController();
    return await authController.GetToken(req);
}


const refresh_token_factory = async (req: any) => {
    const authController = new AuthController();
    return await authController.RefreshToken(req);
}


const logout_factory = async (req: any) => {
    const authController = new AuthController();
    return await authController.Logout(req);
}


auth_router.post('/token', [urlencoded({extended: true}), cookieparser()], RequerstHandlers(get_token_factory));
auth_router.post('/refreshtoken', [urlencoded({extended: true}), cookieparser()], RequerstHandlers(refresh_token_factory));
auth_router.post('/logout', [urlencoded({extended: true}), cookieparser()], RequerstHandlers(logout_factory));


export default auth_router;