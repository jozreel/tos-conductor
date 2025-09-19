import auth_router from "./auth-routes"

const GetRoutes = () => {
    return [
        {path: '/api/auth', module: auth_router}
    ]
}

export default GetRoutes;