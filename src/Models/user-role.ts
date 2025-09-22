import BaseModel from "./base-mopde"

export type UserRoleType = {
    roleid: string,
    userid: string,
    createddate: Date, 
    lastmodifieddate: Date,
    createdby: string,
    lastmodifiedby: string
}

class UserRole extends BaseModel {
    private roleid: string;
    private userid: string;
    public constructor(data: UserRoleType) {
        super(data.createddate, data.lastmodifieddate, data.createdby, data.lastmodifiedby);
        this.roleid = data.roleid;
        this.userid =  data.userid;
    } 

    public get RoleId(): string {
        return this.roleid;
    }

    public set RoleId(role_id: string) {
        this.roleid = this.roleid;
    }

    public get UserId(): string {
        return this.userid;
    }

    public set UserId(usr_id: string) {
        this.userid =  usr_id;
    }
}

export default UserRole;