import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import GetRoutes from './Routes/app-routes';
import cross_origin from './Drivers/cors-helper';
import LoadAuth from './load-auth';

const app =  express();
const routes =  GetRoutes();
app.use(cross_origin)
routes.forEach(r => app.use(r.path, r.module));
(async () => {
    try {
        await LoadAuth();
        app.listen(3776);
        console.log("App is listining on 3776")

    } catch(ex) {
        console.error('couls not start app', {})
    }
})()

