    const cross_origin = (req:any, res:any, next:any) => {
        const allowed = ['http://localhost:5173'];
        const origin = req.headers.origin;
       
        if (allowed.indexOf(origin) >= 0) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api, Authorization, x-auth-token');
        next();

    }

    export default cross_origin;
