import BaseModel from "./base-mopde";

export type RolePermissionType = {
    roleid:  string,
    permissionid: string,
    createddate: Date, 
    lastmodifieddate: Date,
    createdby: string,
    lastmodifiedby: string
}

class RolePermission extends BaseModel {
    private roleid: string;
    private permissionid:  string;

    public constructor(data: RolePermissionType) {
        super(data.createddate, data.lastmodifieddate, data.createdby, data.lastmodifiedby);
        this.roleid = data.roleid;
        this.permissionid = data.permissionid;
    }

    public set  RoleId(role_id: string) {
        this.roleid = role_id;
    }

    public get RoleId(): string {
        return this.roleid;
    }

    public set PermissionId(perm_id: string) {
        this.permissionid =  perm_id;
    }

    public get PermissionId(): string {
        return this.permissionid;
    }
    
}


export default RolePermission;