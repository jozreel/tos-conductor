import BaseModel from "./base-mopde";

class Session extends BaseModel{
    private sessionid: string;
    private token: string;
    private userid: string;
    private refreshtoken?: string;

    public constructor(session_id: string, _token: string, userid: string, createddate: Date, lastmoddate: Date, createdby: string = 'SYSTEM', lastmodifiedby:string='SYSTEM', refrestoken=null) {
        super(createddate, lastmoddate, createdby, lastmodifiedby);
        this.sessionid = session_id;
        this.token =  _token;
        this.userid =  userid;
        this.refreshtoken = refrestoken || '';
    }

    public get SessionId():string {
        return this.sessionid;
    }

    public set SessionId(session_id:string) {
        this.sessionid =  session_id;
    }
    

    public get Token(): string {
        return this.token;
    }

    public set Token(val: string) {
        this.token =  val;
    }

    public get UserId(): string {
        return this.userid;
    }

    public set UserId(val: string) {
        this.userid = val;
    }

    public get RefreshToken():string|undefined {
        return this.refreshtoken;
    }

    public set RefreshToken(val: string) {
        this.refreshtoken = val;
    }

    
}

export default Session;