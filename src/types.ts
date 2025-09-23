export type UserFilter = {
    linit?: number,
    skip?: number,
    createddate?: Date,
    lastmodifieddate?: Date
}

export type AppRequest = {
    data?: any,
    query: any,
    file?: any,
    params: any,
    ip?: string, 
    method: string,
    access?: any,
    credentials?: string,
    appid?: string,
    path: string,
    cookies?: any,
    headers?: any
}