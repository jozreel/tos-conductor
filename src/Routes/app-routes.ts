import auth_router from "./auth-routes"
import user_router from "./user-routes";

const GetRoutes = () => {
    return [
        {path: '/api/auth', module: auth_router},
        {path: '/api/user', module: user_router}
    ]
}

export default GetRoutes;