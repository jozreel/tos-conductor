const RequerstHandlers = (controller: any) => {
    return async (req: any, res: any) => {

        const requestPayload = {
                data: req.body,
                query: req.query,
                file: req.file,
                params: req.params,
                ip: req.ip,
                method: req.method,
                access: req.access,
                credentials: req.headers.authorization,
                path: req.path,
                appid: req.appid,
                cookies: req.cookies,
                headers: {
                    'Content-Type': req.get('Content-Type'),
                    'Referer': req.get('referer'),
                    'User-Agent': req.get('User-Agent')
                }
               
            };

         const result = await controller(requestPayload);

           if(result) {
                if(result.headers) {
                    res.set(result.headers)
                }
                if(result.statusCode) {
                    res.status(res.statusCode);
                }

                if(result.cookies) {
                    result.cookies.forEach((c:any) => res.cookie(c.name, c.value, c.options));
                }
                if(result.clearcookies) {
                    result.clearcookies.forEach((c:any) => res.clearCookie(c.name, c.options));
                }

                if(result.redirect && (result.statusCode === 302 || result.statusCode === 301)) {
                    res.status(result.statusCode).redirect(result.redirect);
                } 

                const type = result.type;
             
                if(type === 'page') {
                    res.type('html');
                    res.set('Content-Type', 'text/html');
                    res.status(result.statusCode)
                    .send(Buffer.from(result.body));
                } else if(type === 'file') {
                    res.type('application/octet-stream');
                    res.status(result.statusCode)
                    console.log('piping')
                    res.body.pipe(result);
                } else if(type === 'redirect') {
                    console.log('redirecting')
                    res.redirect(result.url);
                } else {
                    res.type('json');
                    res.status(result.statusCode)
                    .send(result.body);
                }
            } else {
                result.send('')
            }
        
            


    }
}


export default RequerstHandlers;