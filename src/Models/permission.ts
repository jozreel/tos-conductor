import { FieldLengthError } from "../errors";
import BaseModel from "./base-mopde";
export type PermissionType = {
    id?: string,
    name: string,
    code: string,
    description?:string,
    createddate: Date,
    lastmodifieddate: Date,
    createdby: string,
    lastmodifiedby: string
}
class Permission extends BaseModel {
    private id?:string;
    private name: string;
    private description?: string;
    private readonly max_name: number = 40;
    private readonly max_description: number =  140;


    public constructor(data: PermissionType) {
        super(data.createddate, data.lastmodifieddate,  data.createdby, data.lastmodifiedby);

        if(data.name && data.name.length > this.max_name) {
            throw new FieldLengthError(`Name has a max length of ${ this.max_name}`);
        }
        if(data.description && data.description.length > this.max_description) {
            throw new FieldLengthError(`Description hass a max length of ${this.max_description}`);
        }
        this.id =  data.id;
        this.name = data.name;
        this.description =  data.description;
    }

    public get Name(): string {
        return this.name;
    }

    public set Name(val: string) {
          if(val && val.length > this.max_name) {
            throw new FieldLengthError(`Name has a max length of ${ this.max_name}`);
        }
        this.name = val;
    }

    public set Id(val: string) {
        this.id =  val;
    }

    public get Id(): string | undefined {
        return this.id;
    }

    public get Description(): string | undefined {
        return this.description;
    }

    public set Description(desc: string) {
         if(desc && desc.length > this.max_description) {
            throw new FieldLengthError(`Description hass a max length of ${this.max_description}`);
        }
        this.description =  desc;
    }



}

module.exports = Permission;