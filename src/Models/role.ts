import { FieldLengthError } from "../errors";
import BaseModel from "./base-mopde";

export type  RoleType = {
    id?: string,
    rolename: string,
    description?: string,
    createddate: Date,
    lastmodifieddate: Date,
    createdby: string, 
    lastmodifiedby: string
}

class Role extends BaseModel {

    private id?: string;
    private rolename: string;
    private description?: string;
    private max_rolename: number = 80;
    private max_description: number = 180;
    
    
    public constructor(data: RoleType) {
        super(data.createddate, data.lastmodifieddate, data.createdby, data.lastmodifiedby)
        this.id =  data.id;
        this.description =  data.description;
        this.rolename = data.rolename; 
        if(this.rolename && this.rolename.length > this.max_rolename) {
            throw new FieldLengthError(`Rolename has a max length od ${this.max_rolename}`);
        }

        if(this.description && this.description.length > this.max_description) {
            throw new FieldLengthError(`Description has a max length of ${this.max_description}`);
        }
        

    }

    public set Id(val: string) {
        this.id = val;
    }

    public get Id(): string|undefined {
        return this.id;
    }

    public get RoleName(): string {
        return this.rolename;
    }

    public set RoleName(role_name: string) {
         if(role_name && role_name.length > this.max_rolename) {
            throw new FieldLengthError(`Rolename has a max length od ${this.max_rolename}`);
        }
        this.rolename = role_name;
    }

    public get Description(): string|undefined {
        return this.description;
    }

    public set Description(desc: string) {
        if(desc && desc.length > this.max_description) {
            throw new FieldLengthError(`Description has a max length of ${this.max_description}`);
        }
        this.description = desc;
    }
    
}

module.exports = Role;